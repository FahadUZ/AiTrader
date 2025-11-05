import { Header } from "../Header";
import { ThemeProvider } from "../ThemeProvider";

export default function HeaderExample() {
  return (
    <ThemeProvider>
      <Header />
      <div className="p-6">
        <p className="text-muted-foreground">Content below header...</p>
      </div>
    </ThemeProvider>
  );
}
