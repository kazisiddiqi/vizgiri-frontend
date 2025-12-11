import { useState } from "react";
import axios from "axios";

function App(){
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const upload = async () => {
    if(!file) {
      alert("Choose a CSV file first");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await axios.post("http://localhost:8000/upload", form, {
        headers: {"Content-Type": "multipart/form-data"}
      });
      setSummary(res.data);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check backend is running.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{maxWidth:900, margin:"30px auto", fontFamily:"sans-serif"}}>
      <h1>Vizgiri — Upload CSV</h1>
      <input type="file" accept=".csv" onChange={e=>setFile(e.target.files[0])} />
      <button onClick={upload} style={{marginLeft:12}} disabled={loading}>Upload</button>

      {loading && <p>Uploading & analyzing...</p>}

      {summary && (
        <>
          <h2>Numeric summary</h2>
          <pre>{JSON.stringify(summary.columns, null, 2)}</pre>

          <h2>Preview (first rows)</h2>
          <table border="1" cellPadding="6">
            <thead>
              <tr>{Object.keys(summary.head[0] || {}).map(k=> <th key={k}>{k}</th>)}</tr>
            </thead>
            <tbody>
              {summary.head.map((r,i)=>(
                <tr key={i}>{Object.values(r).map((v,j)=><td key={j}>{String(v)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;
