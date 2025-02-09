import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { read, utils } from 'xlsx';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function DataInput({ onDataUpdate, criteria, setCriteria }) {
  const [formData, setFormData] = useState({
    name: '',
    productivity: '',
    quality: '',
    timeliness: '',
  });
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onDataUpdate(prev => [...prev, formData]);
    setFormData({
      name: '',
      productivity: '',
      quality: '',
      timeliness: '',
    });
  };

  const processFiles = async (files) => {
    const allData = [];
    for (const file of files) {
      try {
        const data = await file.arrayBuffer();
        const workbook = read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = utils.sheet_to_json(worksheet);
        allData.push(...jsonData);
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
      }
    }
    if (allData.length > 0) {
      onDataUpdate(prev => [...prev, ...allData]);
    }
  };

  const handleFileUpload = async (e) => {
    if (e.target.files?.length > 0) {
      await processFiles(e.target.files);
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  }, []);

  const handleWeightChange = (criterion, value) => {
    setCriteria(prev => ({
      ...prev,
      [criterion]: {
        ...prev[criterion],
        weight: parseFloat(value)
      }
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Criteria Weights
        </Typography>
        <Grid container spacing={2}>
          {Object.entries(criteria).map(([criterion, { weight }]) => (
            <Grid item xs={12} sm={4} key={criterion}>
              <TextField
                label={`${criterion.charAt(0).toUpperCase() + criterion.slice(1)} Weight`}
                type="number"
                value={weight}
                onChange={(e) => handleWeightChange(criterion, e.target.value)}
                inputProps={{ step: 0.1, min: 0, max: 1 }}
                fullWidth
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Manual Data Entry
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Name/Entity"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            {Object.keys(criteria).map((criterion) => (
              <Grid item xs={12} sm={4} key={criterion}>
                <TextField
                  name={criterion}
                  label={criterion.charAt(0).toUpperCase() + criterion.slice(1)}
                  type="number"
                  value={formData[criterion]}
                  onChange={handleInputChange}
                  inputProps={{ min: 0, max: 100 }}
                  fullWidth
                  required
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button variant="contained" type="submit" sx={{ mr: 2 }}>
                Add Entry
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mt: 3,
          border: dragActive ? '2px dashed #1976d2' : '2px dashed #ccc',
          backgroundColor: dragActive ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
          transition: 'all 0.3s ease'
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Typography variant="h6" gutterBottom>
          File Upload
        </Typography>
        <Box sx={{ 
          textAlign: 'center', 
          py: 3,
          cursor: 'pointer'
        }}>
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="body1" gutterBottom>
            Drag and drop your Excel/CSV files here
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            or
          </Typography>
          <Button
            variant="contained"
            component="label"
            sx={{ mt: 1 }}
          >
            Select Files
            <input
              type="file"
              hidden
              multiple
              accept=".xlsx,.xls,.csv"
              onChange={handleFileUpload}
            />
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Supports multiple files: .xlsx, .xls, .csv
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default DataInput;