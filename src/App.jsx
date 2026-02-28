import { useState, useEffect } from "react"
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import axios from "axios"
import "./App.css"

function App() {

  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`)

  const [review, setReview] = useState("")
  const [loading, setLoading] = useState(false)

  // Theme state with persistence
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  )

  // Apply theme
  useEffect(() => {
    document.body.className = theme
    localStorage.setItem("theme", theme)
  }, [theme])

  // Prism highlight
  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    try {
      setLoading(true)
      setReview("Analyzing your code... ⏳")

      const response = await axios.post("https://codereviewerbackend-q8mn.onrender.com/ai/get-review",
        { code }
      )

      setReview(response.data)
    } catch (error) {
      setReview("⚠️ Failed to fetch review. Check backend connection.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          padding: "1rem",
          fontSize: "1.8rem",
          fontWeight: "600",
          letterSpacing: "1px",
          background: "linear-gradient(90deg, #6c63ff, #a084ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}
      >
        RefactorX
      </div>

      {/* Theme Toggle */}
      <div className="theme-toggle">
        <label className="switch">
          <input
            type="checkbox"
            checked={theme === "light"}
            onChange={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
          />
          <span className="slider"></span>
        </label>
      </div>

      <main>
        {/* LEFT PANEL */}
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code =>
                prism.highlight(
                  code,
                  prism.languages.javascript,
                  "javascript"
                )
              }
              padding={10}
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 16,
                height: "100%",
                width: "100%",
                background: "transparent",
                color: theme === "light" ? "#000" : "#fff"
              }}
            />
          </div>

          <div
            onClick={!loading ? reviewCode : null}
            className="review"
            style={{
              opacity: loading ? 0.6 : 1,
              pointerEvents: loading ? "none" : "auto"
            }}
          >
            {loading ? "Reviewing..." : "Review"}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right">
          <Markdown rehypePlugins={[rehypeHighlight]}>
            {review}
          </Markdown>
        </div>
      </main>
    </>
  )
}

export default App