// Google Sheets API Helper
const SheetsAPI = {
    baseURL: `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}`,
    
    // READ operations use Google Sheets API (faster, no quota issues)
    async getSheetData(sheetName) {
        try {
            const response = await axios.get(
                `${this.baseURL}/values/${sheetName}?key=${CONFIG.API_KEY}`
            );
            return response.data.values || [];
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },
    
    // WRITE operations use Apps Script proxy
    async updateCell(sheetName, cell, value) {
        try {
            const response = await axios.post(CONFIG.SCRIPT_URL, {
                action: 'updateCell',
                sheetName: sheetName,
                cell: cell,
                value: value
            });
            
            if (response.data.status === 'error') {
                throw new Error(response.data.message);
            }
            return response.data;
        } catch (error) {
            console.error('Error updating cell:', error);
            throw error;
        }
    },
    
    async appendRow(sheetName, values) {
        try {
            const response = await axios.post(CONFIG.SCRIPT_URL, {
                action: 'appendRow',
                sheetName: sheetName,
                values: values
            });
            
            if (response.data.status === 'error') {
                throw new Error(response.data.message);
            }
            return response.data;
        } catch (error) {
            console.error('Error appending row:', error);
            throw error;
        }
    },
    
    async updateRow(sheetName, rowIndex, values) {
    try {
        console.log('Updating row:', sheetName, rowIndex);
        
        // Use CORS proxy for GitHub Pages
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const targetUrl = CONFIG.SCRIPT_URL;
        
        const response = await axios.post(proxyUrl + targetUrl, {
            action: 'updateRow',
            sheetName: sheetName,
            rowIndex: rowIndex,
            values: values
        }, { 
            timeout: 15000,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        if (response.data.status === 'error') {
            throw new Error(response.data.message);
        }
        
        console.log('Row updated successfully');
        return response.data;
    } catch (error) {
        console.error('Error updating row:', error);
        throw error;
    }
}
