import React, { useState } from "react";
import styles from "./styles.module.css";

// drag drop file component
export function DragDropFile({ file, setFile }) {
  const inputRef = React.useRef(null);
  // const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);

  // triggers when file is selected with click
  const handleChange = function (e) {
    e.preventDefault();
    if (
      e.target.files &&
      e.target.files[0]
      // && /[^.]+$/.exec(e.target.files[0].name)[0] == "pdf"
    ) {
      setFile(e.target.files[0]);
      setImage(URL.createObjectURL(e.target.files[0]));
    } else {
      //
    }
  };
  return (
    <div className={styles.image_upload_container}>
      <div className="form-file-upload" onSubmit={(e) => e.preventDefault()}>
        <input
          type="file"
          ref={inputRef}
          id="r_image"
          name="r_image"
          onChange={handleChange}
          className="input-file-upload"
        />
        <label
          id="label-file-upload"
          htmlFor="r_image"
          style={{ cursor: "pointer" }}
        >
          <div>
            <p>Click to upload</p>
          </div>
          <span
            style={{
              fontStyle: "italic",
              fontWeight: "300",
              marginTop: "10px",
            }}
          >
            Drag and drop to upload
          </span>
          {/* <img src="drag.png" alt="drag" /> */}
          {file && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                marginTop: "10px",
              }}
            >
              <img src="image.png" alt="" style={{ width: "30px" }} />
              {file.name}
            </div>
          )}
        </label>
      </div>
    </div>
  );
}
