// Script to populate the watchlist table, handle sorting and searching.

// Wait until the DOM is fully loaded before executing any logic
window.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('stocksTable');
    const tbody = table.querySelector('tbody');
    const searchInput = document.getElementById('searchInput');

    // State for current sorting: which column and whether ascending
    let sortState = { index: null, asc: true };

    /**
     * Render the table body with the provided array of stock objects.
     * @param {Array<Object>} data Array of stock objects to display
     */
    function renderTable(data) {
        // Clear existing rows
        tbody.innerHTML = '';
        // Create a table row for each stock
        data.forEach(item => {
            const tr = document.createElement('tr');

            // Create and append table cells for each property
            const companyTd = document.createElement('td');
            companyTd.textContent = item.company;
            tr.appendChild(companyTd);

            const industryTd = document.createElement('td');
            industryTd.textContent = item.industry;
            tr.appendChild(industryTd);

            const marketCapTd = document.createElement('td');
            marketCapTd.textContent = item.marketCap;
            tr.appendChild(marketCapTd);

            const growthTd = document.createElement('td');
            growthTd.textContent = item.growthDrivers;
            tr.appendChild(growthTd);

            const socialTd = document.createElement('td');
            socialTd.textContent = item.socialMedia;
            tr.appendChild(socialTd);

            const riskTd = document.createElement('td');
            riskTd.textContent = item.keyRisks;
            tr.appendChild(riskTd);

            tbody.appendChild(tr);
        });
    }

    /**
     * Convert a market cap string into a numerical value for sorting.
     * Strips out any non-numeric characters.
     * @param {string} value Market cap string (e.g., "~7.85")
     * @returns {number} Parsed floating-point number or 0 if invalid
     */
    function parseMarketCap(value) {
        if (!value) return 0;
        // Remove any characters except digits and decimal points
        const num = parseFloat(value.replace(/[^0-9.]/g, ''));
        return isNaN(num) ? 0 : num;
    }

    /**
     * Sort an array of stock objects based on a specific column index.
     * Handles both string and numeric sorting.
     * @param {Array<Object>} data Array of stock objects to sort
     * @param {number} columnIndex Index of the column to sort by
     * @returns {Array<Object>} Sorted copy of the input array
     */
    function sortData(data, columnIndex) {
        const sortedData = [...data];
        sortedData.sort((a, b) => {
            let valA, valB;
            // Determine the values based on the column index
            switch (columnIndex) {
                case 0:
                    valA = a.company.toLowerCase();
                    valB = b.company.toLowerCase();
                    break;
                case 1:
                    valA = a.industry.toLowerCase();
                    valB = b.industry.toLowerCase();
                    break;
                case 2:
                    valA = parseMarketCap(a.marketCap);
                    valB = parseMarketCap(b.marketCap);
                    break;
                case 3:
                    valA = a.growthDrivers.toLowerCase();
                    valB = b.growthDrivers.toLowerCase();
                    break;
                case 4:
                    valA = a.socialMedia.toLowerCase();
                    valB = b.socialMedia.toLowerCase();
                    break;
                case 5:
                    valA = a.keyRisks.toLowerCase();
                    valB = b.keyRisks.toLowerCase();
                    break;
                default:
                    valA = '';
                    valB = '';
            }
            // Compare and return based on sort direction
            if (valA < valB) return sortState.asc ? -1 : 1;
            if (valA > valB) return sortState.asc ? 1 : -1;
            return 0;
        });
        return sortedData;
    }

    /**
     * Filter an array of stock objects based on a search term.
     * The term is matched against all property values.
     * @param {Array<Object>} data Array of stock objects
     * @param {string} term Lowercase search term
     * @returns {Array<Object>} Filtered array containing only matching objects
     */
    function filterData(data, term) {
        if (!term) return data;
        return data.filter(item => {
            return Object.values(item).some(value =>
                String(value).toLowerCase().includes(term)
            );
        });
    }

    /**
     * Update the displayed table according to the current search and sort state.
     */
    function updateTable() {
        const term = searchInput.value.trim().toLowerCase();
        let filtered = filterData(stocksData, term);
        if (sortState.index !== null) {
            filtered = sortData(filtered, sortState.index);
        }
        renderTable(filtered);
    }

    // Add click listeners to table headers for sorting
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const colIndex = parseInt(header.getAttribute('data-index'), 10);
            // Toggle sort direction on repeated clicks of the same column
            if (sortState.index === colIndex) {
                sortState.asc = !sortState.asc;
            } else {
                sortState.index = colIndex;
                sortState.asc = true;
            }
            updateTable();
        });
    });

    // Add input listener to search field for live filtering
    searchInput.addEventListener('input', updateTable);

    // Initial render of the table
    updateTable();
});
        // Append criteria section and last updated timestamp
        const containerDiv = document.querySelector('.container');

        // Create criteria section
        const criteriaSection = document.createElement('div');
        criteriaSection.className = 'criteria-section';
        criteriaSection.innerHTML = `
            <h2>Criteria Used</h2>
            <ul>
                <li>Company (Ticker)</li>
                <li>Business &amp; Industry</li>
                <li>Market Cap (USD&nbsp;B)</li>
                <li>Growth Drivers &amp; Fundamentals</li>
                <li>Social‑media/Viral Potential</li>
                <li>Key Risks</li>
            </ul>
        `;
        containerDiv.appendChild(criteriaSection);

        // Create last updated paragraph
        const lastUpdated = document.createElement('p');
        lastUpdated.className = 'last-updated';
        lastUpdated.innerHTML = 'Last updated on January&nbsp;16,&nbsp;2026&nbsp;20:09&nbsp;(Lisbon&nbsp;time)';
        containerDiv.appendChild(lastUpdated);

        // Inject styles for new sections
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            .criteria-section {
                margin-top: 24px;
            }
            .criteria-section h2 {
                margin-bottom: 10px;
                font-size: 20px;
                color: #1976d2;
            }
            .criteria-section ul {
                list-style-type: disc;
                padding-left: 20px;
                margin: 0;
            }
            .criteria-section li {
                margin-bottom: 5px;
            }
            .last-updated {
                margin-top: 12px;
                font-size: 0.9rem;
                color: #555;
                font-style: italic;
            }
        `;
        document.head.appendChild(styleEl);
    });
