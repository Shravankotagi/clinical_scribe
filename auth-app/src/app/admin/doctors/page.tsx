import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { isAuthenticated } from "@/server/user";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default async function DoctorsPage() {
  const session = await isAuthenticated();
  if (!session || session.user.role !== "admin") redirect("/login");

  const doctors = await prisma.user.findMany({
    where: { role: "doctor" },
    orderBy: { createdAt: "desc" },
  });

  async function createDoctor(formData: FormData) {
    "use server";
    const session = await isAuthenticated();
    if (!session || session.user.role !== "admin") redirect("/login");

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) throw new Error("All fields required");

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("User already exists");

    // Use Better Auth's API to create user with properly hashed password
    const response = await fetch(`${process.env.BETTER_AUTH_URL}/api/auth/sign-up/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) throw new Error("Failed to create doctor account");

    const data = await response.json() as { user?: { id: string } };
    
    // Update role to doctor
    if (data.user?.id) {
      await prisma.user.update({
        where: { id: data.user.id },
        data: { role: "doctor", emailVerified: true },
      });
    }

    redirect("/admin/doctors");
  }

  async function toggleDoctorStatus(formData: FormData) {
    "use server";
    const session = await isAuthenticated();
    if (!session || session.user.role !== "admin") redirect("/login");

    const doctorId = formData.get("doctorId") as string;
    const banned = formData.get("banned") === "true";
    await prisma.user.update({ where: { id: doctorId }, data: { banned: !banned } });
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Doctors</h1>
          <p className="text-muted-foreground mt-1">Manage doctor accounts</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>+ Add Doctor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Doctor</DialogTitle>
              <DialogDescription>Create a new doctor account</DialogDescription>
            </DialogHeader>
            <form action={createDoctor} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="Dr. John Smith" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="doctor@clinic.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <Input id="password" name="password" type="password" placeholder="••••••••" required />
              </div>
              <Button type="submit" className="w-full">Create Doctor Account</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No doctors yet. Add your first doctor.
                </TableCell>
              </TableRow>
            ) : (
              doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell className="font-medium">{doctor.name}</TableCell>
                  <TableCell>{doctor.email}</TableCell>
                  <TableCell>{new Date(doctor.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {doctor.banned ? (
                      <Badge variant="destructive">Inactive</Badge>
                    ) : (
                      <Badge variant="default">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <form action={toggleDoctorStatus}>
                      <input type="hidden" name="doctorId" value={doctor.id} />
                      <input type="hidden" name="banned" value={String(doctor.banned)} />
                      <Button type="submit" variant={doctor.banned ? "default" : "destructive"} size="sm">
                        {doctor.banned ? "Activate" : "Deactivate"}
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}