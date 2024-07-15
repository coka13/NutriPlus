import React from "react";
import { Field, useFormikContext } from "formik";
import { TextField } from "@mui/material";

const FormikTextField = ({ name, ...props }) => {
  const formik = useFormikContext();
  return (
    <Field
      name={name}
      component={TextField}
      value={formik.values[name]}
      onChange={(e) => {
        formik.setFieldValue(name, e);
      }}
      error={formik.errors[name]}
      touched={formik.touched[name]}
      helperText={formik.touched[name] && formik.errors[name]}
      type="text"
      fullWidth
      variant="outlined"
      margin="normal"
      className="input-field"
      sx={{
        marginBottom: "10px",
        "& .MuiInputLabel-root.Mui-focused": {
          color: "black",
          fontWeight: "bold",
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: "#B81D33",
          },
          "&:hover fieldset": {
            borderColor: "#B81D33",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#B81D33",
          },
        },
      }}
      {...props}
    />
  );
};

export default FormikTextField;
