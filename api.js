// Google Sheets API Helper
const SheetsAPI = {
    baseURL: `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}`,
    
    // READ operations use Google Sheets API
    async getSheetData(sheetName) {
        try {
            console.log('Fetching data from sheet:', sheetName);
            
            const response = await axios.get(
                `${this.baseURL}/values/${sheetName}?key=${CONFIG.API_KEY}`,
                { timeout: 10000 }
            );
            
            console.log('Data fetched successfully:', response.data.values?.length || 0, 'rows');
            return response.data.values || [];
        } catch (error) {
            console.error('Error fetching data from', sheetName, ':', error);
            throw new Error(`Failed to fetch ${sheetName}: ${error.message}`);
        }
    },
    
    // WRITE operations use Apps Script proxy
    async updateCell(sheetName, cell, value) {
        try {
            console.log('Updating cell:', sheetName, cell, value);
            
            const response = await axios.post(CONFIG.SCRIPT_URL, {
                action: 'updateCell',
                sheetName: sheetName,
                cell: cell,
                value: value
            }, { timeout: 15000 });
            
            if (response.data.status === 'error') {
                throw new Error(response.data.message);
            }
            
            console.log('Cell updated successfully');
            return response.data;
        } catch (error) {
            console.error('Error updating cell:', error);
            throw error;
        }
    },
    
    async appendRow(sheetName, values) {
        try {
            console.log('Appending row to:', sheetName);
            
            const response = await axios.post(CONFIG.SCRIPT_URL, {
                action: 'appendRow',
                sheetName: sheetName,
                values: values
            }, { timeout: 15000 });
            
            if (response.data.status === 'error') {
                throw new Error(response.data.message);
            }
            
            console.log('Row appended successfully');
            return response.data;
        } catch (error) {
            console.error('Error appending row:', error);
            throw error;
        }
    },
    
    async updateRow(sheetName, rowIndex, values) {
        try {
            console.log('Updating row:', sheetName, rowIndex);
            
            const response = await axios.post(CONFIG.SCRIPT_URL, {
                action: 'updateRow',
                sheetName: sheetName,
                rowIndex: rowIndex,
                values: values
            }, { timeout: 15000 });
            
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
};

console.log('✅ SheetsAPI loaded');
