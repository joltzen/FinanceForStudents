/* Copyright (c) 2023, Jason Oltzen */

import { Box, Container, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import CardComp from "../../components/CardComp";
function ImpressumPage() {
  const theme = useTheme();
  return (
    <div>
      <CardComp>
        <Container>
          <Typography variant="h4" gutterBottom>
            Impressum
          </Typography>
          <Box sx={{ color: theme.palette.text.main }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Angaben gemäß § 5 TMG:
            </Typography>
            <Typography>
              Jason Oltzen <br />
              Krefelder Straße 26
              <br />
              41539 Dormagen
            </Typography>
          </Box>
          <Box mt={2} sx={{ color: theme.palette.text.main }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Kontakt:
            </Typography>
            <Typography>E-Mail: webmaster@financeforstudents.de</Typography>
          </Box>
          <Box mt={2} sx={{ color: theme.palette.text.main }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
            </Typography>
            <Typography>
              Jason Oltzen
              <br />
              Krefelder Straße 26
              <br />
              41539 Dormagen
            </Typography>
          </Box>
          <Box mt={2} sx={{ color: theme.palette.text.main }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Haftungsausschluss:
            </Typography>
            <Typography>
              Trotz sorgfältiger inhaltlicher Kontrolle übernehme ich keine
              Haftung für die Inhalte externer Links. Für den Inhalt der
              verlinkten Seiten sind ausschließlich deren Betreiber
              verantwortlich.
            </Typography>
          </Box>
          <Box mt={2} sx={{ color: theme.palette.text.main }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Urheberrecht:
            </Typography>
            <Typography>
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
              diesen Seiten unterliegen dem deutschen Urheberrecht. Die
              Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
              Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der
              schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            </Typography>
          </Box>
        </Container>
      </CardComp>
    </div>
  );
}

export default ImpressumPage;
