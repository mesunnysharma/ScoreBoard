import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DataInput from './components/DataInput';
import Dashboard from './components/Dashboard';
import Comparison from './components/Comparison';
import Export from './components/Export';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [tab, setTab] = useState(0);
  const [scorecardData, setScorecardData] = useState([]);
  const [criteria, setCriteria] = useState({
    productivity: { weight: 0.4, maxScore: 100 },
    quality: { weight: 0.3, maxScore: 100 },
    timeliness: { weight: 0.3, maxScore: 100 },
  });

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleDataUpdate = (newData) => {
    setScorecardData(newData);
  };

  const calculateScore = (entry) => {
    return Object.keys(criteria).reduce((total, criterion) => {
      return total + (entry[criterion] * criteria[criterion].weight);
    }, 0);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box sx={{ width: '100%', mt: 4 }}>
          <Tabs
            value={tab}
            onChange={handleTabChange}
            centered
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
          >
            <Tab label="Data Input" />
            <Tab label="Dashboard" />
            <Tab label="Comparison" />
            <Tab label="Export" />
          </Tabs>

          {tab === 0 && (
            <DataInput 
              onDataUpdate={handleDataUpdate}
              criteria={criteria}
              setCriteria={setCriteria}
            />
          )}
          {tab === 1 && (
            <Dashboard 
              data={scorecardData}
              criteria={criteria}
              calculateScore={calculateScore}
            />
          )}
          {tab === 2 && (
            <Comparison 
              data={scorecardData}
              criteria={criteria}
              calculateScore={calculateScore}
            />
          )}
          {tab === 3 && (
            <Export 
              data={scorecardData}
              criteria={criteria}
              calculateScore={calculateScore}
            />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;