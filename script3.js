// Array to store the investment data
let investments = JSON.parse(localStorage.getItem('investments')) || [];

// Function to calculate the total portfolio value
function calculateTotalValue() {
    return investments.reduce((total, investment) => total + investment.currentValue, 0);
}

// Function to add a new investment
function addInvestment() {
    const assetName = document.getElementById('assetName').value;
    const amountInvested = parseFloat(document.getElementById('amountInvested').value);
    const currentValue = parseFloat(document.getElementById('currentValue').value);

    if (assetName && !isNaN(amountInvested) && !isNaN(currentValue)) {
        investments.push({
            assetName,
            amountInvested,
            currentValue
        });

        // Clear the input fields
        document.getElementById('assetName').value = '';
        document.getElementById('amountInvested').value = '';
        document.getElementById('currentValue').value = '';

        // Update the table, total value and chart
        updateTable();
        updateTotalValue();
        updateChart();
        saveToLocalStorage();
    } else {
        showAlert('Please provide valid input.');
    }
}

// Function to delete an investment
function deleteInvestment(index) {
    const confirmation = confirm("Are you sure you want to delete this investement?.");
    if (confirmation) {
        investments.splice(index, 1);
        updateTable();
        updateTotalValue();
        updateChart();
        saveToLocalStorage();
    }else{
        showAlert("Investment was not deleted.");
    }
}

// Function to update the table
function updateTable() {
    const tableBody = document.getElementById('investmentTable');
    tableBody.innerHTML = '';

    investments.forEach((investment, index) => {
        const percentageChange = ((investment.currentValue - investment.amountInvested) / investment.amountInvested * 100).toFixed(2);

        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${investment.assetName}</td>
            <td>$${investment.amountInvested.toFixed(2)}</td>
            <td>$${investment.currentValue.toFixed(2)}</td>
            <td>${percentageChange}%</td>
            <td>
                <button class="btn-update" onclick="updateInvestment(${index})">Update</button>
                <button class="btn-delete" onclick="deleteInvestment(${index})">Delete</button>
            </td>
        `;
    });
}

// Function to update the total value
function updateTotalValue() {
    document.getElementById('totalValue').innerText = calculateTotalValue().toFixed(2);
}

// Function to update the investment
function updateInvestment(index) {
    const newCurrentValue = parseFloat(prompt('Enter new current value:', investments[index].currentValue));
    if (!isNaN(newCurrentValue)) {
        investments[index].currentValue = newCurrentValue;
        updateTable();
        updateTotalValue();
        updateChart();
        saveToLocalStorage();
    } else {
        showAlert('Invalid value!');
    }
}

// Function to save data to Local Storage
function saveToLocalStorage() {
    localStorage.setItem('investments', JSON.stringify(investments));
}

// Chart.js to visualize portfolio data
let portfolioChart;

function updateChart() {
    const ctx = document.getElementById('portfolioChart').getContext('2d');
    const assetNames = investments.map(inv => inv.assetName);
    const currentValues = investments.map(inv => inv.currentValue);

    if (portfolioChart) {
        portfolioChart.destroy();
    }

    portfolioChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: assetNames,
            datasets: [{
                data: currentValues,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
            }]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Portfolio Distribution'
            }
        }
    });
}

// Initialize the table, total value, and chart on page load
window.onload = () => {
    updateTable();
    updateTotalValue();
    updateChart();
};