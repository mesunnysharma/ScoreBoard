import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { utils, writeFile } from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Export({ data, criteria, calculateScore }) {
  const [loading, setLoading] = useState(false);

  const exportToExcel = () => {
    const exportData = data.map(entry => ({
      Name: entry.name,
      ...Object.keys(criteria).reduce((acc, criterion) => {
        acc[criterion.charAt(0).toUpperCase() + criterion.slice(1)] = entry[criterion];
        return acc;
      }, {}),
      'Total Score': calculateScore(entry),
    }));

    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Scorecard');
    writeFile(wb, 'scorecard_export.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Scorecard Report', 14, 15);
    
    const tableData = data.map(entry => [
      entry.name,
      ...Object.keys(criteria).map(criterion => entry[criterion]),
      calculateScore(entry).toFixed(2),
    ]);

    doc.autoTable({
      head: [['Name', ...Object.keys(criteria).map(c => c.charAt(0).toUpperCase() + c.slice(1)), 'Total Score']],
      body: tableData,
      startY: 25,
    });

    doc.save('scorecard_report.pdf');
  };

  const exportToCSV = () => {
    const exportData = data.map(entry => ({
      Name: entry.name,
      ...Object.keys(criteria).reduce((acc, criterion) => {
        acc[criterion.charAt(0).toUpperCase() + criterion.slice(1)] = entry[criterion];
        return acc;
      }, {}),
      'Total Score': calculateScore(entry),
    }));

    const ws = utils.json_to_sheet(exportData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Scorecard');
    writeFile(wb, 'scorecard_export.csv');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Export Options
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={exportToExcel}
              disabled={loading || data.length === 0}
            >
              Export to Excel
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={exportToPDF}
              disabled={loading || data.length === 0}
            >
              Export to PDF
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={exportToCSV}
              disabled={loading || data.length === 0}
            >
              Export to CSV
            </Button>
          </Grid>
        </Grid>

        {data.length === 0 && (
          <Typography sx={{ mt: 2, color: 'text.secondary' }}>
            No data available to export. Please add some entries first.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}

export default Export;