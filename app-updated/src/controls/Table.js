import {
  Box,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TablePagination,
  IconButton,
} from "@mui/material";
import {
  LastPage as LastPageIcon,
  KeyboardArrowRight,
  KeyboardArrowLeft,
  FirstPage as FirstPageIcon,
} from "@mui/icons-material";

function TablePaginationActions(props) {
  const { count, page, rowsPerPage, onPageChange } = props;
  const lastPage = Math.ceil(count / rowsPerPage) - 1;
  const handleFirstPageButtonClick = (e) => onPageChange(e, 0);
  const handleBackButtonClick = (e) => onPageChange(e, page - 1);
  const handleNextButtonClick = (e) => onPageChange(e, page + 1);
  const handleLastPageButtonClick = (e) =>
    onPageChange(e, Math.max(0, lastPage));

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0}>
        <FirstPageIcon />
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton onClick={handleNextButtonClick} disabled={page >= lastPage}>
        <KeyboardArrowRight />
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= lastPage}
      >
        <LastPageIcon />
      </IconButton>
    </Box>
  );
}

function CustomTable({
  rowsPerPage,
  setPage,
  page,
  setRowsPerPage,
  columns,
  rows,
  isDone,
  count,
}) {
  const emptyRows = rowsPerPage - rows?.length;
  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    const newRowsPerPage = parseInt(e.target.value);
    if (newRowsPerPage === count) {
      setPage(0);
      setRowsPerPage(count);
      return;
    }
    setRowsPerPage(newRowsPerPage);
    const newPage = Math.min(page, Math.floor(rows?.length / newRowsPerPage));
    setPage(newPage);
  };

  return (
    <>
      {isDone && rows?.length > 0 && (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {columns?.map((elem, idx) => {
                  return (
                    <TableCell
                      component="th"
                      scope="row"
                      key={idx}
                      align={elem?.thAlign}
                      sx={{
                        maxWidth: 200, // percentage also works
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {elem.title}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows?.map((row, idxRow) => (
                <TableRow key={row._id}>
                  {columns?.map((elem, idxCol) => (
                    <TableCell
                      key={`${idxRow}-${idxCol}`}
                      align={elem?.tdAlign}
                    >
                      {elem.formatter(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={columns?.length} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  count={count}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[
                    10,
                    20,
                    30,
                    {
                      label: "All",
                      value: count,
                    },
                  ]}
                  colSpan={columns?.length}
                  SelectProps={{
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
      {isDone && rows?.length === 0 && (
        <TableContainer>
          <Table size="small" sx={{ mt: 2 }}>
            <TableBody>
              <TableRow>
                <TableCell>No data found.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}

export default CustomTable;
