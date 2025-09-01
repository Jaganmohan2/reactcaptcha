import React from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import API_BASE_URL from "./config";
import ProtectedPage from "./ProtectedPage";

function Home() {
  const [publicMsg, setPublicMsg] = React.useState("");
  const [captchaHtml, setCaptchaHtml] = React.useState(null);
  const navigate = useNavigate();

  // --- Common API call with CAPTCHA handling ---
  async function callApi(path, setMsg) {
    try {
      const token = localStorage.getItem("x-aws-waf-token");

      const res = await fetch(`${API_BASE_URL}${path}`, {
        headers: token ? { "x-aws-waf-token": token } : {},
      });

      const text = await res.text();

      // Detect CAPTCHA challenge (HTML response)
      if (text.startsWith("<!DOCTYPE html>") && text.includes("Human Verification")) {
        console.log("⚠️ CAPTCHA challenge triggered");
        setCaptchaHtml(text); // render inside iframe
      } else {
        setMsg(text);
        setCaptchaHtml(null); // clear if solved
      }
    } catch (err) {
      console.error("API Error:", err);
    }
  }

  // Call Public API
  function callPublic() {
    callApi("/api/public", setPublicMsg);
  }

  // Navigate to protected page
  function goToProtectedPage() {
    navigate("/protected");
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>React + Spring Boot - AWS WAF CAPTCHA Demo</h2>

      <div>
        <button onClick={callPublic}>Call /api/public</button>
        <div style={{ marginTop: 8 }}>{publicMsg}</div>
      </div>

      {captchaHtml && (
        <div style={{ marginTop: 20 }}>
          <h3>⚠️ CAPTCHA Verification Required</h3>
          <iframe
            title="captcha"
            srcDoc={captchaHtml}
            style={{ width: "100%", height: 500, border: "1px solid #ccc" }}
          />
          <p>Once you solve the CAPTCHA, click the button again.</p>
        </div>
      )}

      <hr />
      <div>
        <button onClick={goToProtectedPage}>Go to Protected Page</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/protected" element={<ProtectedPage />} />
      </Routes>
    </Router>
  );
}

export default App;
