import { MantineProvider } from "@mantine/core";
// import "@mantine/core/styles.css";

const theme = {
  primaryColor: "blue",
  fontFamily: "Inter, sans-serif",
  colorScheme: "light" as const,
  components: {
    Button: {
      defaultProps: {
        size: "md",
      },
    },
    TextInput: {
      defaultProps: {
        size: "md",
      },
    },
    Select: {
      defaultProps: {
        size: "md",
      },
    },
  },
};

export function MantineThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      {children}
    </MantineProvider>
  );
}
