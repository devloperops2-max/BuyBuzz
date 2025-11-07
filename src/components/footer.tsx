export function Footer() {
  return (
    <footer className="bg-muted py-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Lumina. All rights reserved.</p>
      </div>
    </footer>
  );
}
