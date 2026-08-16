/* =====================================================
   CROWD RESOURCE ALLOCATION
   RANKING SCRIPT
   ===================================================== */


document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadRanking();

    }
);


/* =====================================================
   LOAD RANKING
   ===================================================== */

function loadRanking() {

    const container =
        document.getElementById(
            "ranking-container"
        );


    if (!container) {

        return;
    }


    container.innerHTML = `
        <div class="loading">
            Calculating resource priority...
        </div>
    `;


    fetch("../backend/ranking.php")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Server connection failed."
                );

            }

            return response.json();

        })

        .then(data => {

            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Unable to load ranking."
                );

            }


            displayRanking(
                data.requests || []
            );

        })

        .catch(error => {

            console.error(
                "Ranking error:",
                error
            );


            container.innerHTML = `
                <div class="message error">
                    Failed to load ranking.
                    Please check your server.
                </div>
            `;

        });

}


/* =====================================================
   DISPLAY RANKING
   ===================================================== */

function displayRanking(requests) {

    const container =
        document.getElementById(
            "ranking-container"
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
                    There are currently
                    no requests to rank.
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
            "rank-card";


        const rank =
            Number(request.rank);


        const finalScore =
            Number(
                request.final_score
            ).toFixed(2);


        card.innerHTML = `

            <div class="rank-number">

                ${rank}

            </div>


            <div class="rank-content">

                <h3>

                    Request #${escapeHTML(
                        request.request_id
                    )}

                </h3>


                <p>

                    <strong>
                        Resource:
                    </strong>

                    ${escapeHTML(
                        request.resource_name
                    )}

                </p>


                <p>

                    <strong>
                        Description:
                    </strong>

                    ${escapeHTML(
                        request.description
                    )}

                </p>


                <div class="request-info">


                    <div class="info-box">

                        <strong>
                            Need
                        </strong>

                        ${escapeHTML(
                            request.need_score
                        )}

                    </div>


                    <div class="info-box">

                        <strong>
                            Urgency
                        </strong>

                        ${escapeHTML(
                            request.urgency_score
                        )}

                    </div>


                    <div class="info-box">

                        <strong>
                            Votes
                        </strong>

                        ${escapeHTML(
                            request.vote_count
                        )}

                    </div>


                    <div class="info-box">

                        <strong>
                            Waiting Days
                        </strong>

                        ${escapeHTML(
                            request.waiting_days
                        )}

                    </div>


                </div>


                <h3>

                    Final Score:

                    <span class="score">

                        ${finalScore}

                    </span>

                </h3>


                <details>

                    <summary>
                        View Score Calculation
                    </summary>


                    <div class="request-info">


                        <div class="info-box">

                            <strong>
                                Need Contribution
                            </strong>

                            ${escapeHTML(
                                request.need_contribution
                            )}

                        </div>


                        <div class="info-box">

                            <strong>
                                Urgency Contribution
                            </strong>

                            ${escapeHTML(
                                request.urgency_contribution
                            )}

                        </div>


                        <div class="info-box">

                            <strong>
                                Community Contribution
                            </strong>

                            ${escapeHTML(
                                request.community_contribution
                            )}

                        </div>


                        <div class="info-box">

                            <strong>
                                Waiting Contribution
                            </strong>

                            ${escapeHTML(
                                request.waiting_contribution
                            )}

                        </div>


                    </div>

                </details>


                <p>

                    <span class="badge badge-pending">

                        Pending

                    </span>

                </p>

            </div>

        `;


        container.appendChild(card);

    });

}