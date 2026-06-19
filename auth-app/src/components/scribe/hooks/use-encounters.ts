"use client"

import useSWR from "swr"
import type { Encounter } from "@/lib/scribe-storage/types"
import {
  getEncounters,
  saveEncounters,
  createEncounter,
  updateEncounter,
  deleteEncounter,
} from "@/lib/scribe-storage/encounters"
import { writeAuditEntry } from "@/lib/scribe-storage/audit-log"

export function useEncounters() {
  const { data: encounters = [], mutate } = useSWR<Encounter[]>("encounters", () => getEncounters(), {
    fallbackData: [],
    revalidateOnFocus: false,
  })

  const addEncounter = async (data: Partial<Encounter>) => {
    try {
      const existingIdx = encounters.findIndex(e => e.id === data.id)
      let updated: Encounter[]
      let targetEncounter: Encounter
      if (existingIdx > -1) {
        const copy = [...encounters]
        copy[existingIdx] = { ...copy[existingIdx], ...data }
        updated = copy
        targetEncounter = copy[existingIdx]
      } else {
        const newEncounter = createEncounter(data)
        updated = [newEncounter, ...encounters]
        targetEncounter = newEncounter
      }

      // Sort by created_at DESC to preserve sequence at all costs
      updated.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      await saveEncounters(updated)
      await mutate(updated, false)

      // Audit log: encounter created
      await writeAuditEntry({
        event_type: existingIdx > -1 ? "encounter.updated" : "encounter.created",
        resource_id: targetEncounter.id,
        success: true,
        metadata: {
          status: targetEncounter.status,
          has_patient_name: !!targetEncounter.patient_name,
        },
      })

      return targetEncounter
    } catch (error) {
      // Audit log: encounter creation failed
      await writeAuditEntry({
        event_type: "encounter.created",
        success: false,
        error_message: error instanceof Error ? error.message : String(error),
      })
      throw error
    }
  }

  const update = async (id: string, updates: Partial<Encounter>) => {
    try {
      const updated = updateEncounter(encounters, id, updates)
      await saveEncounters(updated)
      await mutate(updated, false)

      // Audit log: encounter updated
      await writeAuditEntry({
        event_type: "encounter.updated",
        resource_id: id,
        success: true,
        metadata: {
          fields_updated: Object.keys(updates),
          status_changed: updates.status ? true : false,
        },
      })
    } catch (error) {
      // Audit log: encounter update failed
      await writeAuditEntry({
        event_type: "encounter.updated",
        resource_id: id,
        success: false,
        error_message: error instanceof Error ? error.message : String(error),
      })
      throw error
    }
  }

  const remove = async (id: string) => {
    try {
      const updated = deleteEncounter(encounters, id)
      await saveEncounters(updated)
      await mutate(updated, false)

      // Audit log: encounter deleted
      await writeAuditEntry({
        event_type: "encounter.deleted",
        resource_id: id,
        success: true,
      })
    } catch (error) {
      // Audit log: encounter deletion failed
      await writeAuditEntry({
        event_type: "encounter.deleted",
        resource_id: id,
        success: false,
        error_message: error instanceof Error ? error.message : String(error),
      })
      throw error
    }
  }

  return {
    encounters,
    addEncounter,
    updateEncounter: update,
    deleteEncounter: remove,
    refresh: mutate,
  }
}
