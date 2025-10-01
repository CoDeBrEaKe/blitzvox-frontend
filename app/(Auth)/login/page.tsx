"use client";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { loginUser, clearError, checkAuth } from "@/redux/slices/authSlice";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from "@/public/logo.png";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      router.push("/clients");
    }
  }, [user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      loginUser({ username: formData.username, password: formData.password })
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing again
    if (error) {
      dispatch(clearError());
    }
  };

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white shadow rounded-lg p-4 flex flex-col gap-4 min-w-[320px] md:min-w-[500px]">
        <img src={logo.src} className="max-w-40 max-h-40 self-center" />
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start justify-center gap-4 w-full"
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

          {/* Show error message */}
          {error && (
            <p className="text-red-500 text-sm font-medium w-full text-center">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-500 self-center cursor-pointer"
          >
            {loading ? "Anmeldung ..." : "Anmeldung"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default Page;
