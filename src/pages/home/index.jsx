/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import styles from "./styles.module.css";
import { useData } from "../../contexts/appContext";
import { DragDropFile } from "../../components/fileupload";

function Home() {
  const data = useData();
  const [file, setFile] = useState(null);
  const [cluster, setCluster] = useState("");
  const [first, setFirst] = useState("#ffffff");
  const [second, setSecond] = useState("#000000");

  const [result, setResult] = useState(null);

  function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : null;
  }

  const submitData = async () => {
    if (file) {
      setResult(null);
      setTimeout(async () => {
        let formData = new FormData();

        const f = hexToRgb(first);
        const s = hexToRgb(second);
        console.log(f.toString());
        formData.append("image", file);
        formData.append("clusters", 2);
        formData.append("first", `[${f.toString()}]`);
        formData.append("second", `[${s.toString()}]`);

        const response = await data.requests.getImage(formData);
        console.log(response.data);
        setResult(response.data.file);
      }, 500);
    } else {
      alert("You did not choose any file!");
    }
  };

  return (
    <div className={styles.container}>
      <DragDropFile file={file} setFile={setFile} />
      <input
        type="text"
        placeholder="How many colors?"
        value={2}
        onChange={(e) => setCluster(e.target.value)}
      />
      <div className={styles.colors}>
        <div>
          <label htmlFor="favcolor1">Select first color</label>
          <input
            type="color"
            id="favcolor1"
            name="favcolor1"
            value={first}
            onChange={(e) => setFirst(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="favcolor2">Select second color</label>
          <input
            type="color"
            id="favcolor2"
            name="favcolor2"
            value={second}
            onChange={(e) => setSecond(e.target.value)}
          />
        </div>
      </div>

      <button onClick={submitData}>Submit</button>

      {result && (
        <div>
          <h1>Result</h1>
          <img
            src={`${import.meta.env.VITE_BASE_URL}/${result}`}
            alt="image"
            style={{
              width: "100%",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Home;
