import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';

function Comparison({ data, criteria, calculateScore }) {
  const [selected, setSelected] = useState([]);

  const handleSelectChange = (event) => {
    setSelected(event.target.value);
  };

  const comparisonData = Object.keys(criteria).map(criterion => ({
    subject: criterion.charAt(0).toUpperCase() + criterion.slice(1),
    ...selected.reduce((acc, name) => {
      const entry = data.find(d => d.name === name);
      if (entry) {
        acc[name] = Number(entry[criterion]);
      }
      return acc;
    }, {}),
  }));

  const scoreData = selected.map(name => {
    const entry = data.find(d => d.name === name);
    return {
      name,
      score: calculateScore(entry),
    };
  }).sort((a, b) => b.score - a.score);

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Select Entities to Compare</InputLabel>
          <Select
            multiple
            value={selected}
            onChange={handleSelectChange}
            label="Select Entities to Compare"
          >
            {data.map((entry) => (
              <MenuItem key={entry.name} value={entry.name}>
                {entry.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      {selected.length > 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Performance Comparison
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <RadarChart
                  width={600}
                  height={400}
                  data={comparisonData}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  {selected.map((name, index) => (
                    <Radar
                      key={name}
                      name={name}
                      dataKey={name}
                      stroke={`hsl(${index * 360 / selected.length}, 70%, 50%)`}
                      fill={`hsl(${index * 360 / selected.length}, 70%, 50%)`}
                      fillOpacity={0.6}
                    />
                  ))}
                  <Legend />
                </RadarChart>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Rankings
              </Typography>
              <Box sx={{ mt: 2 }}>
                {scoreData.map((item, index) => (
                  <Typography key={item.name} variant="body1" sx={{ mb: 1 }}>
                    {index + 1}. {item.name} - Score: {item.score.toFixed(2)}
                  </Typography>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default Comparison;