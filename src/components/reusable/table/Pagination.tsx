import { useEffect, useState } from "react";
import { Col, Pagination, Row } from "react-bootstrap";

const PaginationTable = ({
  limit,
  initialPage,
  total,
  onChangePage,
  supportMobile = false
}: {
  limit: number;
  total: number;
  initialPage: number;
  onChangePage: any;
  supportMobile?: boolean
}) => {
  const [currentPage, setCurrentpage] = useState<number>(initialPage || 1);
  const [canPreviousPage, setCanPreviousPage] = useState<boolean>(false);
  const [canNextPage, setCanNextPage] = useState<boolean>(false);

  useEffect(() => {
    if (initialPage && limit && total) {
      setCurrentpage(initialPage);
      setDisabled(initialPage);
    }
  }, [initialPage, limit, total]);

  const totalPages = Math.ceil(total / limit);

  const gotoPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentpage(page);
      setDisabled(page);
      onChangePage(page);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) gotoPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) gotoPage(currentPage + 1);
  };

  const setDisabled = (page: number) => {
    setCanPreviousPage(page > 1);
    setCanNextPage(page < totalPages);
  };

  const getPaginationNumbers = () => {
    if (totalPages <= 1) return [];
    if (currentPage === 1) return [1, 2, 3].filter(p => p <= totalPages);
    if (currentPage === totalPages) return [totalPages - 2, totalPages - 1, totalPages].filter(p => p >= 1);
    return [currentPage - 1, currentPage, currentPage + 1];
  };

  return (
    <>
      {
        total > 0 ? (
          <Row className={supportMobile ? "mt-2" : "mt-3"}>
            <Col md="6" className={supportMobile ? "text-md-start text-center mt-2" : ""}>
              <span className="mx-2">
                Menampilkan <strong>{(currentPage - 1) * limit + 1}</strong> ke <strong>{Math.min(currentPage * limit, total)}</strong> dari <strong>{total}</strong> data
              </span>
            </Col>
            {
              total > 10 ? (
                <Col md="6" className={supportMobile ? "d-flex d-md-block justify-content-center mt-2" : ""}>
                  <Pagination className="float-end">
                    <Pagination.First onClick={() => gotoPage(1)} disabled={!canPreviousPage} />
                    <Pagination.Prev onClick={previousPage} disabled={!canPreviousPage} />
                    {getPaginationNumbers().map((page) => (
                      <Pagination.Item key={page} active={page === currentPage} onClick={() => gotoPage(page)}>
                        {page}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={nextPage} disabled={!canNextPage} />
                    <Pagination.Last onClick={() => gotoPage(totalPages)} disabled={!canNextPage} />
                  </Pagination>
                </Col>
              ) : (<></>)
            }
          </Row>
        ) :
        (<></>)
      }
    </>
  );
};

export default PaginationTable;
