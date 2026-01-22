import ExcelJS from 'exceljs';

export async function exportToExcel(data: any[], filename: string) {
    try {
        const response = await fetch('/assets/files/sample_export.xlsx');
        if (!response.ok) {
            throw new Error('Failed to fetch template file');
        }
        const arrayBuffer = await response.arrayBuffer();

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
            throw new Error('No worksheet found in template');
        }

        const startRow = 2;
        const templateRow = worksheet.getRow(startRow);

        if (data.length > 1) {
            worksheet.insertRows(startRow + 1, new Array(data.length - 1).fill(null));
        }

        data.forEach((item, index) => {
            const rowIndex = startRow + index;
            const currentRow = worksheet.getRow(rowIndex);

            if (index > 0) {
                currentRow.height = templateRow.height;
                templateRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    currentRow.getCell(colNumber).style = cell.style;
                });
            }

            currentRow.getCell(1).value = item.STT;
            currentRow.getCell(2).value = item['Tên Đơn vị hưởng'];
            currentRow.getCell(3).value = item['Số tài khoản hưởng'];
            currentRow.getCell(4).value = item['Ngân hàng hưởng'];
            currentRow.getCell(5).value = item['Số tiền'];
            currentRow.getCell(6).value = item['Diễn giải chi tiết'];

            currentRow.commit();
        });

        const buffer = await workbook.xlsx.writeBuffer();

        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);

    } catch (error) {
        console.error('Error exporting to Excel:', error);
        alert('Failed to export to Excel. Please check the console for details.');
    }
}

export async function exportWalletToExcel(data: any[], filename: string) {
    try {
        const response = await fetch('/assets/files/sample_transaction_export.xlsx');
        if (!response.ok) {
            throw new Error('Failed to fetch template file');
        }
        const arrayBuffer = await response.arrayBuffer();

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
            throw new Error('No worksheet found in template');
        }

        const startRow = 2;
        const templateRow = worksheet.getRow(startRow);

        if (data.length > 1) {
            worksheet.insertRows(startRow + 1, new Array(data.length - 1).fill(null));
        }

        data.forEach((item, index) => {
            const rowIndex = startRow + index;
            const currentRow = worksheet.getRow(rowIndex);

            if (index > 0) {
                currentRow.height = templateRow.height;
                templateRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                    currentRow.getCell(colNumber).style = cell.style;
                });
            }

            currentRow.getCell(1).value = item.stt;
            currentRow.getCell(2).value = item.sender;
            currentRow.getCell(3).value = item.receiver;
            currentRow.getCell(4).value = item.receiverAccount;
            currentRow.getCell(5).value = item.receiverBank;
            currentRow.getCell(6).value = item.amount;
            currentRow.getCell(7).value = item.type;
            currentRow.getCell(8).value = item.status;
            currentRow.getCell(9).value = item.date;

            currentRow.commit();
        });

        const totalRowIndex = startRow + data.length;
        const totalRow = worksheet.getRow(totalRowIndex);

        totalRow.getCell(1).value = 'TỔNG CỘNG';
        totalRow.getCell(1).font = { bold: true };
        totalRow.getCell(6).font = { bold: true };
        totalRow.commit();


        const buffer = await workbook.xlsx.writeBuffer();

        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
        URL.revokeObjectURL(link.href);

    } catch (error) {
        console.error('Error exporting wallet to Excel:', error);
        alert('Failed to export wallet to Excel. Please check the console for details.');
    }
}
