const SheetsAPI = {
    baseURL: `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}`,
    
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
            console.error('Error fetching data:', error);
            throw new Error(`Failed to fetch ${sheetName}: ${error.message}`);
        }
    },
    
    async updateCell(sheetName, cell, value) {
        return this._writeOperation('updateCell', { sheetName, cell, value });
    },
    
    async appendRow(sheetName, values) {
        return this._writeOperation('appendRow', { sheetName, values });
    },
    
    async updateRow(sheetName, rowIndex, values) {
        return this._writeOperation('updateRow', { sheetName, rowIndex, values });
    },
    
    async _writeOperation(action, data) {
        try {
            console.log(`${action}:`, data);
            
            const payload = { action, ...data };
            
            const response = await fetch(CONFIG.SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // This bypasses CORS
                headers: {
                    'Content-Type': 'text/plain'
                },
                body: JSON.stringify(payload)
            });
            
            // With no-cors, we can't read response
            // So we assume success if no error thrown
            console.log(`${action} request sent successfully`);
            
            // Wait a moment for sheet to update
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return { status: 'success', message: `${action} completed` };
            
        } catch (error) {
            console.error(`Error in ${action}:`, error);
            throw error;
        }
    }
};

console.log('✅ SheetsAPI loaded');
