/* =====================================================
   CROWD RESOURCE ALLOCATION
   MAIN SCRIPT
   ===================================================== */


document.addEventListener(
    "DOMContentLoaded",
    function () {

        checkSession();

    }
);


/* =====================================================
   CHECK LOGIN SESSION
   ===================================================== */

function checkSession() {

    fetch("../backend/check_session.php")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Server returned an error."
                );

            }

            return response.json();

        })

        .then(data => {

            if (!data.logged_in) {

                // If current page is not login page,
                // redirect to login.

                if (
                    !window.location.pathname
                        .includes("login.html")
                ) {

                    window.location.href =
                        "login.html";
                }

                return;
            }


            displayUser(data.user);

        })

        .catch(error => {

            console.error(
                "Session error:",
                error
            );

        });

}


/* =====================================================
   DISPLAY USER INFORMATION
   ===================================================== */

function displayUser(user) {

    const userName =
        document.getElementById("user-name");

    const userEmail =
        document.getElementById("user-email");

    const userRole =
        document.getElementById("user-role");


    if (userName) {

        userName.textContent =
            user.name;
    }


    if (userEmail) {

        userEmail.textContent =
            user.email;
    }


    if (userRole) {

        userRole.textContent =
            user.role;
    }

}


/* =====================================================
   LOGOUT
   ===================================================== */

function logout() {

    fetch("../backend/logout.php")

        .then(response =>
            response.json()
        )

        .then(data => {

            if (data.success) {

                window.location.href =
                    "login.html";

            }

        })

        .catch(error => {

            console.error(
                "Logout error:",
                error
            );

        });

}


/* =====================================================
   SHOW MESSAGE
   ===================================================== */

function showMessage(
    elementId,
    message,
    type = "info"
) {

    const element =
        document.getElementById(elementId);


    if (!element) {

        return;
    }


    element.textContent =
        message;


    element.className =
        "message " + type;

}


/* =====================================================
   HTML ESCAPE
   Prevents user-entered text from becoming HTML
   ===================================================== */

function escapeHTML(value) {

    if (value === null ||
        value === undefined) {

        return "";
    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =====================================================
   FORMAT DATE
   ===================================================== */

function formatDate(dateString) {

    if (!dateString) {

        return "";
    }


    const date =
        new Date(
            dateString.replace(" ", "T")
        );


    if (isNaN(date.getTime())) {

        return dateString;
    }


    return date.toLocaleString();

}