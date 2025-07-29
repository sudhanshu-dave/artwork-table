import { useEffect, useRef, useState } from "react";
import { DataTable, type DataTablePageEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";

export interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

export default function ArtworkTable() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [first, setFirst] = useState(0);
  const rows = 12;

  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [selectCount, setSelectCount] = useState<number | "">("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const opRef = useRef<OverlayPanel>(null);

  const loadData = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/artworks?page=${page}&limit=${rows}`
      );
      const json = await res.json();
      setArtworks(json.data);
      setTotalRecords(json.total || 100);
    } catch (err) {
      console.error("Error loading data:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    const page = Math.floor(first / rows) + 1;
    loadData(page);
  }, [first]);

  const onPage = (e: DataTablePageEvent) => {
    setFirst(e.first);
  };

  const onSelectionChange = (e: { value: Artwork[] }) => {
    const currentSelections: Artwork[] = e.value;
  
    const currentPageIDs = new Set(artworks.map((a) => a.id));
  
    const retainedFromOtherPages = selectedArtworks.filter(
      (a) => !currentPageIDs.has(a.id)
    );
  
    setSelectedArtworks([...retainedFromOtherPages, ...currentSelections]);
  };
  

  const renderDropdownHeader = () => (
    <div className="flex justify-content-center items-center">
      <Button
        icon={isDropdownOpen ? "pi pi-angle-up" : "pi pi-angle-down"}
        text
        rounded
        size="small"
        className="p-0 shadow-none bg-transparent hover:bg-transparent"
        onClick={(e) => {
          setIsDropdownOpen(!isDropdownOpen);
          opRef.current?.toggle(e);
        }}
        aria-haspopup
        aria-controls="selectDropdown"
      />
      <OverlayPanel
        ref={opRef}
        id="selectDropdown"
        onHide={() => setIsDropdownOpen(false)}
      >
        <div className="p-2" style={{ minWidth: "150px" }}>
          <div className="flex flex-column gap-2">
            <InputText
              type="number"
              placeholder="select rows"
              value={selectCount !== "" ? String(selectCount) : ""}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setSelectCount(isNaN(val) ? "" : val);
              }}
            />
            <div className="flex justify-content-between gap-2">
              <Button
                label="Clear"
                size="small"
                severity="secondary"
                
                onClick={async () => {
                  if (typeof selectCount === "number" && selectCount > 0) {
                    const needed = selectCount;
                    const pageSize = rows;
                    const currentPage = Math.floor(first / pageSize) + 1;
                    const pagesToFetch = Math.ceil(needed / pageSize);
                    const fetchedData: Artwork[] = [];

                    for (let i = 0; i < pagesToFetch; i++) {
                      const page = currentPage + i;
                      try {
                        const res = await fetch(
                          `http://localhost:3000/api/artworks?page=${page}&limit=${rows}`
                        );
                        const json = await res.json();
                        fetchedData.push(...json.data);
                      } catch (err) {
                        console.error(`Error fetching page ${page}:`, err);
                      }
                    }

                    setSelectedArtworks((prev) =>
                      prev.filter(
                        (art) =>
                          !fetchedData.some((fetched) => fetched.id === art.id)
                      )
                    );
                  } else {
                    setSelectedArtworks((prev) =>
                      prev.filter(
                        (art) => !artworks.some((a) => a.id === art.id)
                      )
                    );
                  }

                  setSelectCount("");
                  opRef.current?.hide();
                }}
              />
              <Button
                label="Submit"
                size="small"
                onClick={async () => {
                  if (typeof selectCount === "number" && selectCount > 0) {
                    const needed = selectCount;
                    const pageSize = rows;
                    const currentPage = Math.floor(first / pageSize) + 1;
                    const pagesToFetch = Math.ceil(needed / pageSize);
                    const fetchedData: Artwork[] = [];

                    for (let i = 0; i < pagesToFetch; i++) {
                      const page = currentPage + i;
                      try {
                        const res = await fetch(
                          `http://localhost:3000/api/artworks?page=${page}&limit=${rows}`
                        );
                        const json = await res.json();
                        fetchedData.push(...json.data);
                      } catch (err) {
                        console.error(`Error fetching page ${page}:`, err);
                      }
                    }

                    const selected = fetchedData.slice(0, needed);
                    const others = selectedArtworks.filter(
                      (art) => !fetchedData.some((a) => a.id === art.id)
                    );
                    setSelectedArtworks([...others, ...selected]);
                  } else {
                    setSelectedArtworks(
                      selectedArtworks.filter(
                        (art) => !artworks.some((a) => a.id === art.id)
                      )
                    );
                  }
                  opRef.current?.hide();
                }}
              />
            </div>
          </div>
        </div>
      </OverlayPanel>
    </div>
  );

  return (
    <div className="card">
      <DataTable
        value={artworks}
        lazy
        paginator
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        onPage={onPage}
        loading={loading}
        dataKey="id"
        selection={artworks.filter((a) =>
            selectedArtworks.some((s) => s.id === a.id)  
        )}
        rowHover
        onSelectionChange={onSelectionChange}
        selectionMode="checkbox"
        onRowClick={(e) => {
          const clickedRow = e.data;
          const isSelected = selectedArtworks.some(
            (a) => a.id === clickedRow.id
          );
          if (isSelected) {
            setSelectedArtworks((prev) =>
              prev.filter((a) => a.id !== clickedRow.id)
            );
          } else {
            setSelectedArtworks((prev) => [...prev, clickedRow]);
          }
        }}
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}  />
        <Column
          header={renderDropdownHeader()}
          style={{ width: "2rem" }}
          body={() => null}
          exportable={false}
        />
        <Column field="title" header="Title" style={{ width: "20%" }} />
        <Column field="place_of_origin" header="Place of Origin" style={{ width: "20%" }} />
        <Column field="artist_display" header="Artist" style={{ width: "20%" }} />
        <Column field="inscriptions" header="Inscriptions" style={{ width: "25%" }} />
        <Column field="date_start" header="Start Date" style={{ width: "7%" }} />
        <Column field="date_end" header="End Date" style={{ width: "7%" }} />
      </DataTable>
    </div>
  );
}
