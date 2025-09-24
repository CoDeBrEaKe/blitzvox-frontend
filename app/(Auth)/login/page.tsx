"use client";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { loginUser, logoutUser, clearError } from "@/redux/slices/authSlice";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from "@/public/logo.png";
const page = () => {
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      loginUser({ username: formData.username, password: formData.password })
    );
    console.log(user);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  console.log("Current auth state:", { user, loading, error });

  return (
    <div className="bg-white shadow rounded-lg  p-4 flex flex-col gap-4 min-w-[320px] md:min-w-[500px]">
      <img src={logo.src} className="max-w-40 max-h-30 self-center" />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-start justify-center gap-4"
      >
        <Label htmlFor="username">Benutzername</Label>
        <Input
          type="text"
          name="username"
          onChange={handleInputChange}
          id="username"
          value={formData.username}
        />
        <Label htmlFor="password">Passwort</Label>
        <Input
          type="password"
          name="password"
          onChange={handleInputChange}
          id="password"
          value={formData.password}
        />
        <Button className="bg-blue-500 self-center cursor-pointer">
          {loading ? "Anmeldung ..." : "Anmeldung"}
        </Button>
      </form>
    </div>
  );
};

export default page;
