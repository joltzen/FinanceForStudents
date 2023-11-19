import BarChartIcon from "@mui/icons-material/BarChart";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PaymentsIcon from "@mui/icons-material/Payments";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Grid,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Heading from "../../components/heading";
import Heading2 from "../../components/heading2";
import Page from "../../components/page";
import Text from "../../components/text";
import strings from "../../config/strings";

const faqs = [
  {
    question: "Wie kann ich mich bei FinanceForStudents registrieren?",
    answer:
      "Um sich bei FinanceForStudents zu registrieren, besuchen Sie unsere Website und klicken Sie auf die Schaltfläche 'Registrieren'. Folgen Sie den Anweisungen, um Ihr Konto zu erstellen und beginnen Sie noch heute mit der Verwaltung Ihrer Finanzen.",
  },
  {
    question: "Wie erstelle ich ein Budget auf FinanceForStudents?",
    answer:
      "Nachdem Sie sich angemeldet haben, navigieren Sie zum Bereich 'Budget' in Ihrem Konto. Dort finden Sie die Option 'Neues Budget erstellen'. Geben Sie Ihre geplanten Einnahmen und Ausgaben ein, und legen Sie Ihre finanziellen Ziele fest. Sie können Ihr Budget jederzeit bearbeiten, indem Sie auf das Bearbeiten-Symbol neben Ihrem Budget in der Übersichtsseite klicken.",
  },
  {
    question: "Wie kann ich Transaktionen kategorisieren?",
    answer:
      "Transaktionen können direkt bei der Eingabe oder nachträglich kategorisiert werden. Öffne die Transaktion, die du kategorisieren möchtest, und wähle dann eine Kategorie aus der Liste aus oder erstelle eine neue Kategorie.",
  },
  {
    question: "Wie sicher ist meine Finanzinformation bei FinanceForStudents?",
    answer:
      "Deine Sicherheit hat für uns höchste Priorität. Wir verwenden fortschrittliche Verschlüsselungstechnologien und Sicherheitsprotokolle, um deine Daten zu schützen. Zudem erfolgt keine Weitergabe deiner Informationen an Dritte ohne deine ausdrückliche Zustimmung.",
  },
  {
    question: "Was mache ich, wenn ich mein Passwort vergessen habe?",
    answer:
      "Wenn du dein Passwort vergessen hast, klicke auf der Anmeldeseite auf 'Passwort vergessen?' und gib die E-Mail-Adresse ein, mit der du dich registriert hast. Du erhältst dann Anweisungen zum Zurücksetzen deines Passworts per E-Mail.",
  },
  {
    question: "Wie verfolge ich wiederkehrende Ausgaben oder Einnahmen?",
    answer:
      "Wiederkehrende Ausgaben oder Einnahmen können direkt auf der 'Fixkosten' Seite angepasst werden. Zusätzlich können Sie auch die Fixkosten von einem bestimmten Monat auf einen anderen übertragen.",
  },
  {
    question: "Kann ich Ziele für das Sparen festlegen?",
    answer:
      "Über die 'Sparziele' Seite kannst du deine Sparziele festlegen und verfolgen. Du kannst deine Ziele jederzeit bearbeiten, indem du auf das Bearbeiten-Symbol neben deinem Ziel in der Übersichtsseite klickst.",
  },
  {
    question: "Kann ich mein Bankkonto mit FinanceForStudents verbinden?",
    answer:
      "Momentan gibt es leider noch nicht die Möglichkeit Ihr Bankkonto mit FinanceForStudents zu verbinden. Wir arbeiten jedoch daran, diese Funktion in naher Zukunft zu implementieren.",
  },
  {
    question: "Wie kann ich die Währung in FinanceForStudents ändern?",
    answer:
      "Momentan gibt es leider noch nicht die Möglichkeit die Währung in FinanceForStudents zu ändern. Wir arbeiten jedoch daran, diese Funktion in naher Zukunft zu implementieren.",
    //"Du kannst die Währungseinstellungen in deinem Profil ändern. Gehe zu deinen 'Konto-Einstellungen' und wähle dort 'Währung ändern', um die gewünschte Währung auszuwählen.",
  },
  {
    question: "Bietet FinanceForStudents auch Tools zur Investitionsplanung?",
    answer:
      "Momentan gibt es leider noch nicht die Möglichkeit deine Anlagekonten mit FinanceForStudents zu verbinden. Wir arbeiten jedoch daran, diese Funktion in naher Zukunft zu implementieren.",
    //"Ja, FinanceForStudents bietet Werkzeuge zur Planung deiner Investitionen. Du kannst deine Anlagekonten hinzufügen, Investitionsziele setzen und deine Fortschritte mit unseren Planungstools verfolgen.",
  },
  {
    question:
      "Wie aktualisiere ich meine persönlichen Informationen oder Kontoeinstellungen?",
    answer:
      "Diese Funktion ist noch nicht verfügbar. Wir arbeiten jedoch daran, diese Funktion in naher Zukunft zu implementieren.",
    // "Um deine persönlichen Informationen oder Kontoeinstellungen zu aktualisieren, gehe zu deinem 'Profil' und klicke auf 'Konto bearbeiten'. Dort kannst du deine Informationen aktualisieren und deine Einstellungen ändern.",
  },
];

function HomePage() {
  const theme = useTheme();
  return (
    <Page>
      <img
        src="/logos/Logo_transparant.png"
        alt="Logo"
        style={{ width: "60%", marginBottom: "20px" }}
      />
      <Container maxWidth="xl" sx={{ mt: 10 }}>
        <Box sx={{ flexGrow: 1, padding: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ mt: 1 }}>
                <strong>{strings.homepage.welcomeMessage}</strong>
              </Typography>
              <Heading2 text={strings.homepage.wm2} />
            </Grid>
            <Grid item xs={6}>
              <Text text={strings.homepage.mission}></Text>

              <Button
                variant="contained"
                color="primary"
                sx={{ marginRight: 3, mt: 5 }}
                href="/signup"
              >
                Leg los
              </Button>
              <Button
                variant="outlined"
                sx={{
                  mt: 5,
                  borderColor: theme.palette.text.main,
                  color: theme.palette.text.main,
                  "&:hover": {
                    borderColor: theme.palette.text.main,
                  },
                }}
                href="/about"
              >
                Erfahre mehr
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Container maxWidth="xl" sx={{ mt: 10 }}>
        <Box sx={{ flexGrow: 1, padding: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Grid item xs={12} textAlign="center">
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{ mr: 10 }}
                  gutterBottom
                >
                  {strings.new.control}
                </Typography>
              </Grid>
              <Typography variant="body1" paragraph marginTop={3}>
                {strings.new.start}
              </Typography>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
                marginTop={2}
              >
                <Grid item xs={6}>
                  <Typography variant="h6" gutterBottom>
                    <strong>Verfolgen</strong>
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6" gutterBottom>
                    <strong>Planen</strong>
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
              >
                <Grid item xs={6}>
                  <Typography variant="body1" marginBottom={5} marginTop={3}>
                    {" "}
                    {strings.new.track}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1" marginTop={1}>
                    {strings.new.plan}
                  </Typography>
                </Grid>
              </Grid>

              <Button
                variant="contained"
                color="primary"
                sx={{ marginRight: 3, mt: 5 }}
                href="/signup"
              >
                Leg los
              </Button>
              <Button
                variant="outlined"
                sx={{
                  mt: 5,
                  borderColor: theme.palette.text.main,
                  color: theme.palette.text.main,
                  "&:hover": {
                    borderColor: theme.palette.text.main,
                  },
                }}
                href="/about"
              >
                Erfahre mehr
              </Button>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                component="img"
                sx={{
                  width: "80%", // Width in pixels
                  height: "80%",
                }}
                src={"/logos/logo.png"}
                alt="My Icon"
              />
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Container maxWidth="xl" sx={{ mt: 10 }}>
        <Box sx={{ flexGrow: 1, padding: 4 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} textAlign="center">
              <Heading text={strings.homepage.how} />
            </Grid>
            <Grid item xs={12} md={4} textAlign="center" marginTop={4}>
              <PaymentsIcon
                sx={{
                  color: theme.palette.secondary.main,
                  mb: 2,
                  fontSize: 40,
                }}
              />
              <Typography variant="h6" gutterBottom>
                {strings.homepage.how1}
              </Typography>
              <Typography variant="body1">{strings.homepage.how11}</Typography>
            </Grid>
            <Grid item xs={12} md={4} textAlign="center" marginTop={4}>
              <ShoppingCartIcon
                sx={{
                  color: theme.palette.secondary.main,
                  mb: 2,
                  fontSize: 40,
                }}
              />
              <Typography variant="h6" gutterBottom>
                {strings.homepage.how2}
              </Typography>
              <Typography variant="body1">{strings.homepage.how21}</Typography>
            </Grid>
            <Grid item xs={12} md={4} textAlign="center" marginTop={4}>
              <BarChartIcon
                sx={{
                  color: theme.palette.secondary.main,
                  mb: 2,
                  fontSize: 40,
                }}
              />

              <Typography variant="h6" gutterBottom>
                {strings.homepage.how3}
              </Typography>
              <Typography variant="body1">{strings.homepage.how31}</Typography>
            </Grid>
            <Grid item xs={12} textAlign="center" sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginRight: 3, mt: 5 }}
                href="/signup"
              >
                Leg los
              </Button>
              <Button
                variant="outlined"
                sx={{
                  mt: 5,
                  borderColor: theme.palette.text.main,
                  color: theme.palette.text.main,
                  "&:hover": {
                    borderColor: theme.palette.text.main,
                  },
                }}
                href="/about"
              >
                Erfahre mehr
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Container maxWidth="xl" sx={{ mt: 10 }}>
        <Box
          sx={{ width: "100%", maxWidth: 800, margin: "auto", mt: 4, mb: 4 }}
        >
          <Grid item xs={12} textAlign="center">
            <Typography variant="h4" gutterBottom>
              FAQs
            </Typography>
          </Grid>
          <Typography variant="subtitle1" gutterBottom sx={{ mb: 3 }}>
            {strings.new.question}
          </Typography>
          {faqs.map((faq, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  <strong>{faq.question}</strong>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
          <Box textAlign="center" sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Noch Fragen?
            </Typography>
            <Button
              variant="outlined"
              href="/contact"
              sx={{
                mt: 3,
                borderColor: theme.palette.text.main,
                color: theme.palette.text.main,
                "&:hover": {
                  borderColor: theme.palette.text.main,
                },
              }}
            >
              Kontakt
            </Button>
          </Box>
        </Box>
      </Container>
    </Page>
  );
}
export default HomePage;
