import React, { useState } from "react";

const BASE = "http://localhost:5000";

export default function App() {
  const [view, setView] = useState("signup"); // signup | login | forgot | dashboard
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Signup fields
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");

  // Forgot password fields
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [forgotStage, setForgotStage] = useState(0); // 0 = send email, 1 = set new pw

  async function registerUser(e) {
    e?.preventDefault();
    setMsg("");
    if (!first || !last || !email || !pw) { setMsg("All fields required"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstname: first, lastname: last, email, password: pw }),
      });
      const json = await res.json();
      setMsg(json.message || "No response");
      if (res.status === 201) {
        setFirst(""); setLast(""); setEmail(""); setPw("");
        setTimeout(() => setView("login"), 900);
      }
    } catch (err) {
      setMsg("Network error");
    } finally { setLoading(false); }
  }

  async function loginUser(e) {
    e?.preventDefault();
    setMsg("");
    if (!loginEmail || !loginPw) { setMsg("Email and password required"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPw }),
      });
      const json = await res.json();
      setMsg(json.message || "");
      if (json.message === "LOGIN_SUCCESS") {
        setView("dashboard");
      }
    } catch (err) {
      setMsg("Network error");
    } finally { setLoading(false); }
  }

  async function sendForgotEmail(e) {
    e?.preventDefault();
    setMsg("");
    if (!forgotEmail) { setMsg("Email required"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/forgotpass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const json = await res.json();
      setMsg(json.message || "");
      if (res.ok) setForgotStage(1);
    } catch (err) {
      setMsg("Network error");
    } finally { setLoading(false); }
  }

  async function setNewPassword(e) {
    e?.preventDefault();
    setMsg("");
    if (newPw.length < 8) { setMsg("Password must be at least 8 chars"); return; }
    if (newPw !== confirmPw) { setMsg("Passwords do not match"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/setpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, password: newPw }),
      });
      const json = await res.json();
      setMsg(json.message || "");
      if (json.message === "Password Changed") {
        setTimeout(() => {
          setForgotStage(0);
          setForgotEmail(""); setNewPw(""); setConfirmPw("");
          setView("login");
        }, 700);
      }
    } catch (err) {
      setMsg("Network error");
    } finally { setLoading(false); }
  }

  function logout() {
    setView("login");
    setMsg("");
    setLoginEmail(""); setLoginPw("");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="bg-cover bg-center" style={{ backgroundImage: `url('/public/images/halie-west-25xggax4bSA-unsplash.jpg')` }}>
          <div className="h-full bg-black bg-opacity-40 flex flex-col items-center justify-center p-6">
            <img src="/public/images/odin-lined.png" alt="odin" className="h-24 mb-4" />
            <h1 className="text-white text-5xl font-extrabold">ODIN</h1>
            <p className="text-gray-200 mt-4 text-center">This is not a real online service — sign up to get started.</p>
          </div>
        </div>

        <div className="p-8">
          {view === "signup" && (
            <>
              <h2 className="text-2xl font-semibold mb-4">Let's do this!</h2>
              <form onSubmit={registerUser} className="space-y-4">
                <div className="flex gap-4">
                  <input value={first} onChange={e => setFirst(e.target.value)} placeholder="First name" className="flex-1 p-3 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-300" />
                  <input value={last} onChange={e => setLast(e.target.value)} placeholder="Last name" className="flex-1 p-3 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-300" />
                </div>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-300" />
                <input value={pw} onChange={e => setPw(e.target.value)} type="password" placeholder="Password (8+ chars)" minLength={8} className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-300" />
                <div className="flex items-center gap-4">
                  <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Create Account</button>
                  <button type="button" onClick={() => setView("login")} className="text-sm text-indigo-600">Already have an account? Log in</button>
                </div>
                {msg && <p className="text-sm text-red-600">{msg}</p>}
              </form>
            </>
          )}

          {view === "login" && (
            <>
              <h2 className="text-2xl font-semibold mb-4">Log In</h2>
              <form onSubmit={loginUser} className="space-y-4">
                <input value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="Email" className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-300" />
                <input value={loginPw} onChange={e => setLoginPw(e.target.value)} type="password" placeholder="Password" className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-300" />
                <div className="flex items-center justify-between">
                  <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Log In</button>
                  <button type="button" onClick={() => { setView("forgot"); setMsg(""); }} className="text-sm text-indigo-600">Forgot password?</button>
                </div>
                <div>
                  <p className="text-sm">Don't have an account? <button onClick={() => setView("signup")} className="text-indigo-600">Sign Up</button></p>
                </div>
                {msg && <p className="text-sm text-red-600">{msg}</p>}
              </form>
            </>
          )}

          {view === "forgot" && (
            <>
              <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>

              {forgotStage === 0 && (
                <form onSubmit={sendForgotEmail} className="space-y-4">
                  <input value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="Enter your email" className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-300" />
                  <div className="flex gap-4">
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Send</button>
                    <button type="button" onClick={() => setView("login")} className="px-4 py-2 rounded border">Back</button>
                  </div>
                  {msg && <p className="text-sm text-red-600">{msg}</p>}
                </form>
              )}

              {forgotStage === 1 && (
                <form onSubmit={setNewPassword} className="space-y-4">
                  <input value={newPw} onChange={e => setNewPw(e.target.value)} type="password" placeholder="New password" className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-300" />
                  <input value={confirmPw} onChange={e => setConfirmPw(e.target.value)} type="password" placeholder="Confirm new password" className="w-full p-3 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-300" />
                  <div className="flex gap-4">
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Reset Password</button>
                    <button type="button" onClick={() => { setForgotStage(0); setMsg(""); }} className="px-4 py-2 rounded border">Back</button>
                  </div>
                  {msg && <p className="text-sm text-red-600">{msg}</p>}
                </form>
              )}
            </>
          )}

          {view === "dashboard" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Welcome to your dashboard!</h2>
              <p className="mb-4">This is where you can manage your account and access features.</p>
              <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Log out</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}