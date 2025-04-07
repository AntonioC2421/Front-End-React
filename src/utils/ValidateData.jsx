export function ValidateData(data, categoria) {
    const ValidateId = data.id ? parseFloat(data.id) : NaN;
    const ValidateName = data.name ? data.name.trim() : "";
    const ValidateLastName = data.last_name ? data.last_name.trim() : "";
    const ValidateEmail = data.email ? data.email.trim() : "";
    const ValidateAlumnoId = data.alumno_id  ? parseFloat(data.alumno_id) : NaN;
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

    // Validar ID
    if (isNaN(ValidateId)) {
        messageError = "ID debe ser un número entero";
    } else if (!Number.isInteger(ValidateId)) {
        messageError = "ID no puede ser un número decimal";
    } else if (ValidateId === 0) {
        messageError = "ID no puede ser 0";
    } else {
        IdValid = true;
    }

    
    // Validar Nombre
    let minLegthName = 3;
    let maxLegthName = 10;

    if (ValidateName.length >= minLegthName && ValidateName.length <= maxLegthName) {
        NameValid = true;
    } else {
        messageError = `El Nombre debe tener entre ${minLegthName} y ${maxLegthName} caracteres.`;
    }

    // Validar Apellido
    let minLegthLastName = 4;
    let maxLegthLastName = 13;

    if (ValidateLastName.length >= minLegthLastName && ValidateLastName.length <= maxLegthLastName) {
        LastNameValid = true;
    } else {
        messageError = `El Apellido debe tener entre ${minLegthLastName} y ${maxLegthLastName} caracteres.`;
    }

    //Validacion Email
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const ValidacionEmail = emailRegex.test(ValidateEmail);

    if (!ValidacionEmail){
        messageError = "Email no valido";
    } else {
        EmailValid = true;
    }

    switch (categoria) {
        case "alumnos":
            if (IdValid && NameValid && LastNameValid && EmailValid) {
                return { success: true, data };
            } else {
                return {
                    success: false,
                    messageError: messageError,
                };
            }
        default:
            return { success: false, messageError: "Categoría no existe" };
    }
}
