import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

function Dashboard({ data, criteria, calculateScore }) {
  const getAverageScores = () => {
    if (!data.length) return {};
    return Object.keys(criteria).reduce((acc, criterion) => {
      acc[criterion] = data.reduce((sum, entry) => sum + Number(entry[criterion]), 0) / data.length;
      return acc;
    }, {});
  };

  const averageScores = getAverageScores();

  const barData = data.map(entry => ({
    name: entry.name,
    score: calculateScore(entry),
    ...Object.keys(criteria).reduce((acc, criterion) => {
      acc[criterion] = Number(entry[criterion]);
      return acc;
    }, {}),
  }));

  const radarData = Object.keys(criteria).map(criterion => ({
    subject: criterion.charAt(0).toUpperCase() + criterion.slice(1),
    average: averageScores[criterion] || 0,
  }));

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Overall Performance Scores
            </Typography>
            <Box sx={{ height: 400 }}>
              <BarChart
                width={800}
                height={350}
                data={barData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#8884d8" name="Total Score" />
              </BarChart>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Category Performance
            </Typography>
            <Box sx={{ height: 400 }}>
              <RadarChart
                width={400}
                height={350}
                cx="50%"
                cy="50%"
                outerRadius="80%"
                data={radarData}
              >
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar
                  name="Average Score"
                  dataKey="average"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Category Breakdown
            </Typography>
            <Box sx={{ height: 400 }}>
              <BarChart
                width={400}
                height={350}
                data={barData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {Object.keys(criteria).map((criterion, index) => (
                  <Bar
                    key={criterion}
                    dataKey={criterion}
                    fill={`hsl(${index * 120}, 70%, 50%)`}
                  />
                ))}
              </BarChart>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;