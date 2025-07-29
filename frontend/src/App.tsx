import ArtworkTable from './components/ArtworkTable';

function App() {
  return (
    <div className="p-4">
      <h1 className="mb-4">Art Institute of Chicago - Artworks Listing </h1>
      <div className="flex justify-content-center">
      <ArtworkTable />
      </div>
    </div>
  );
}

export default App;
