/* =====================================================
   CROWD RESOURCE ALLOCATION
   VOTING SCRIPT
   ===================================================== */


let currentRequests = [];


document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadRequests();

    }
);


/* =====================================================
   LOAD REQUESTS
   ===================================================== */

function loadRequests() {

    const container =
        document.getElementById(
            "requests-container"
        );


    if (!container) {

        return;
    }


    container.innerHTML = `
        <div class="loading">
            Loading requests...
        </div>
    `;


    fetch("../backend/get_requests.php")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Unable to connect to server."
                );

            }

            return response.json();

        })

        .then(data => {

            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Unable to load requests."
                );

            }


            currentRequests =
                data.requests || [];


            displayRequests(
                currentRequests
            );

        })

        .catch(error => {

            console.error(
                "Request loading error:",
                error
            );


            container.innerHTML = `
                <div class="message error">
                    Failed to load requests.
                    Please check whether
                    XAMPP Apache and MySQL
                    are running.
                </div>
            `;

        });

}


/* =====================================================
   DISPLAY REQUESTS
   ===================================================== */

function displayRequests(requests) {

    const container =
        document.getElementById(
            "requests-container"
        );


    if (!container) {

        return;
    }


    if (!requests ||
        requests.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>No Pending Requests</h3>
                <p>
                    There are currently no
                    pending resource requests.
                </p>
            </div>
        `;

        return;
    }


    container.innerHTML = "";


    requests.forEach(request => {

        const card =
            document.createElement("div");


        card.className =
            "request-card";


        card.innerHTML = `

            <h3>
                Request #${escapeHTML(
                    request.request_id
                )}
            </h3>

            <p>
                <strong>Resource:</strong>
                ${escapeHTML(
                    request.resource_name
                )}
            </p>

            <p>
                <strong>Requested by:</strong>
                ${escapeHTML(
                    request.user_name
                )}
            </p>

            <p>
                <strong>Description:</strong>
                ${escapeHTML(
                    request.description
                )}
            </p>


            <div class="request-info">

                <div class="info-box">

                    <strong>Need Score</strong>

                    ${escapeHTML(
                        request.need_score
                    )}

                </div>


                <div class="info-box">

                    <strong>Urgency Score</strong>

                    ${escapeHTML(
                        request.urgency_score
                    )}

                </div>


                <div class="info-box">

                    <strong>Community Votes</strong>

                    <span id="vote-count-${
                        request.request_id
                    }">

                        ${escapeHTML(
                            request.vote_count
                        )}

                    </span>

                </div>


                <div class="info-box">

                    <strong>Created</strong>

                    ${formatDate(
                        request.created_at
                    )}

                </div>

            </div>


            <p>

                <span class="badge badge-pending">

                    Pending

                </span>

            </p>


            <button
                class="vote-btn"
                onclick="voteForRequest(
                    ${Number(
                        request.request_id
                    )}
                )"
            >
                Vote for this Request
            </button>

        `;


        container.appendChild(card);

    });

}


/* =====================================================
   VOTE FOR REQUEST
   ===================================================== */

function voteForRequest(requestId) {

    if (!requestId ||
        Number(requestId) <= 0) {

        alert(
            "Invalid request ID."
        );

        return;
    }


    const confirmation =
        confirm(
            "Are you sure you want to vote for Request #" +
            requestId +
            "?\n\nYou can vote only once."
        );


    if (!confirmation) {

        return;
    }


    const formData =
        new FormData();


    formData.append(
        "request_id",
        requestId
    );


    fetch("../backend/vote.php", {

        method: "POST",

        body: formData

    })

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Server connection failed."
                );

            }

            return response.json();

        })

        .then(data => {

            if (data.success) {

                alert(
                    "Vote submitted successfully!"
                );


                loadRequests();

            } else {

                alert(
                    data.message ||
                    "Unable to submit vote."
                );

            }

        })

        .catch(error => {

            console.error(
                "Voting error:",
                error
            );


            alert(
                "Server connection failed. " +
                "Please make sure XAMPP Apache " +
                "and MySQL are running."
            );

        });

}