export function ValidateData(data, categoria) {
    console.log("Validando datos:", data);

    const ValidateId = data.id ? parseFloat(data.id) : NaN;
    const ValidateName = data.name ? data.name.trim() : "";
    const ValidateLastName = data.last_name ? data.last_name.trim() : "";
    const ValidateEmail = data.email ? data.email.trim() : "";
    const ValidateAlumnoId = data.alumno_id ? parseFloat(data.alumno_id) : NaN;
    const ValidateCursoId = data.curso_id ? parseFloat(data.curso_id) : NaN;
    const ValidateProfesorId = data.id_profesor ? parseFloat(data.id_profesor) : NaN;

    let IdValid = false;
    let NameValid = false;
    let LastNameValid = false;
    let EmailValid = false;
    let AlumnoIdValid = false;
    let CursoIdValid = false;
    let ProfesorIdValid = false;

    let messageError = "";

    switch (categoria) {
        case "alumnos":
            // ID
            if (isNaN(ValidateId)) {
                messageError = "ID debe ser un número entero";
            } else if (!Number.isInteger(ValidateId)) {
                messageError = "ID no puede ser un número decimal";
            } else if (ValidateId === 0) {
                messageError = "ID no puede ser 0";
            } else {
                IdValid = true;
            }

            // Nombre
            if (ValidateName.length >= 3 && ValidateName.length <= 10) {
                NameValid = true;
            } else {
                messageError = "El Nombre debe tener entre 3 y 10 caracteres.";
            }

            // Apellido
            if (ValidateLastName.length >= 4 && ValidateLastName.length <= 13) {
                LastNameValid = true;
            } else {
                messageError = "El Apellido debe tener entre 4 y 13 caracteres.";
            }

            // Email
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (emailRegex.test(ValidateEmail)) {
                EmailValid = true;
            } else {
                messageError = "Email no válido";
            }

            if (IdValid && NameValid && LastNameValid && EmailValid) {
                return { success: true, data };
            } else {
                return { success: false, messageError };
            }

        case "profesores":
            if (isNaN(ValidateId)) {
                messageError = "ID debe ser un número entero";
            } else if (!Number.isInteger(ValidateId)) {
                messageError = "ID no puede ser un número decimal";
            } else if (ValidateId === 0) {
                messageError = "ID no puede ser 0";
            } else {
                IdValid = true;
            }

            if (ValidateName.length >= 3 && ValidateName.length <= 10) {
                NameValid = true;
            } else {
                messageError = "El Nombre debe tener entre 3 y 10 caracteres.";
            }

            if (ValidateLastName.length >= 4 && ValidateLastName.length <= 13) {
                LastNameValid = true;
            } else {
                messageError = "El Apellido debe tener entre 4 y 13 caracteres.";
            }

            if (IdValid && NameValid && LastNameValid) {
                return { success: true, data };
            } else {
                return { success: false, messageError };
            }

        case "matriculas":
            if (isNaN(ValidateId) || !Number.isInteger(ValidateId) || ValidateId <= 0) {
                messageError = "ID debe ser un número entero mayor que 0";
            } else {
                IdValid = true;
            }

            if (isNaN(ValidateAlumnoId) || !Number.isInteger(ValidateAlumnoId) || ValidateAlumnoId <= 0) {
                messageError = "ID del alumno debe ser un número entero mayor que 0";
            } else {
                AlumnoIdValid = true;
            }

            if (isNaN(ValidateCursoId) || !Number.isInteger(ValidateCursoId) || ValidateCursoId <= 0) {
                messageError = "ID del curso debe ser un número entero mayor que 0";
            } else {
                CursoIdValid = true;
            }

            if (IdValid && AlumnoIdValid && CursoIdValid) {
                return { success: true, data };
            } else {
                return { success: false, messageError };
            }

        default:
            return { success: false, messageError: "Categoría no existe" };
    }
}
