// pages/dashboard.tsx
import "bootstrap/dist/css/bootstrap.min.css"
import { useEffect, useInsertionEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import styles from '../../styles/Dashboard.module.css';
import { useRouter } from "next/router";


interface FormData {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    city: string;
    state: string;
    zipCode: string;
    urls: null | string
    created_at: string;
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
const Dashboard = () => {
    const [activeMenu, setActiveMenu] = useState<string>('dashboard');
    const [data, setData] = useState<FormData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(10);
    const [pdfOpen, setPdfOpen] = useState(0)
    const router = useRouter();

    const cookies = new Cookies();
    const authToken = cookies.get('authToken');

    useEffect(() => {
        if (!authToken) {
            router.replace("/")
        }
        const fetchData = async () => {
            try {
                const response = await fetch(baseUrl + `/api/v1/form/list?page=${page}&limit=${itemsPerPage}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    },
                    credentials: 'include'
                });
                if (response.status == 401) {
                    router.replace("/")
                }
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                setData(result.data);
                setTotalPages(result.pagination?.totalPages);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [authToken, page]);

    const menuItems = ['dashboard'];

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const ValidJSON = (str: string | null) => {
        try {
            if (!str) return false
            const data = JSON.parse(str);
            return data;
        } catch (error) {
            return [];
        }
    };

    // Handler to approve the form
    const handleApprove = async (id: string) => {
        setLoading(true);
        try {
            // Call the newCreate endpoint for approval
            const response = await fetch(`${baseUrl}/api/v1/form/newcreate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                if (response.status === 404) {
                    router.push("/");
                }
                throw new Error("Failed to approve");
            }

            window.alert("Form approved successfully");

            // Refresh data using the newList endpoint
            const listResponse = await fetch(`${baseUrl}/api/v1/form/newlist?page=${page}&limit=${itemsPerPage}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
                credentials: 'include',
            });
            const result = await listResponse.json();
            setData(result.data);
            setTotalPages(result.pagination?.totalPages);
        } catch (error: any) {
            console.error("Error approving form:", error);
            //setError(error?.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <nav>
                    <ul>
                        {menuItems.map((item) => (
                            <li
                                key={item}
                                className={activeMenu === item ? styles.active : ''}
                                onClick={() => setActiveMenu(item)}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>
            <main className={styles.content}>
                <h1>{activeMenu}</h1>
                {activeMenu === 'dashboard' && (
                    <>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div className={styles['table-container']}>
                                <table className={"table table-striped"}>
                                    <thead>
                                        <tr >
                                            <th className='col'>ID</th>
                                            <th className='col'>First Name</th>
                                            <th className='col'>Middle Name</th>
                                            <th className='col'>Last Name</th>
                                            <th className='col'>Email Address</th>
                                            <th className='col'>Phone Number</th>
                                            <th className='col'>City</th>
                                            <th className='col'>State</th>
                                            <th className='col'>Zip Code</th>
                                            <th className='col'>Created At</th>
                                            <th className='col' colSpan={3}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className={styles.tableBody}>
                                        {data.map((item, index) => {
                                            let urls = []
                                            if (item.urls) {
                                                urls = ValidJSON(item.urls)
                                            }
                                            return (
                                                <>
                                                    <tr key={item.id}>
                                                        <td>{(index + 1)}</td>
                                                        <td>{item.firstName}</td>
                                                        <td>{item.middleName}</td>
                                                        <td>{item.lastName}</td>
                                                        <td>{item.emailAddress}</td>
                                                        <td>{item.phoneNumber}</td>
                                                        <td>{item.city}</td>
                                                        <td>{item.state}</td>
                                                        <td>{item.zipCode}</td>
                                                        <td>{new Date(item?.created_at)?.toLocaleDateString("en-US")}</td>
                                                        <td><button type="button" onClick={() => setPdfOpen(pre => index + 1 == pre ? 0 : index + 1)} className="btn btn-light">PDF</button></td>
                                                        <td><button type="button" onClick={() => router.push({
                                                            pathname: '/dashboard/edit',
                                                            query: { id: item.id },
                                                        })} className="btn btn-light">EDIT</button></td>
                                                        <td><button type="button" onClick={() => handleApprove(item.id)} className="btn btn-light">Approve</button></td>
                                                    </tr>
                                                    <tr>
                                                        {index + 1 == pdfOpen && <td colSpan={12}>
                                                            {!!urls.length ? (
                                                                urls.sort((a: any, b: any) => {
                                                                    const fileNameA = (a || "").split('\\').pop().toLowerCase();
                                                                    const fileNameB = (b || "").split('\\').pop().toLowerCase();
                                                                    return fileNameA.localeCompare(fileNameB);
                                                                }).map((url: string, index: number) => (
                                                                    <div key={index}>
                                                                        <img src="/pdf.png" alt="pdf" className="pdficon" /><a target="_blank" href={"/" + url}>{(url || "").split('\\').pop()}</a>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                "No PDF Data "
                                                            )}
                                                        </td>}
                                                    </tr>
                                                </>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <nav aria-label="Page navigation">
                            <ul className="pagination">
                                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(page - 1)}>
                                        Previous
                                    </button>
                                </li>
                                {[...Array(totalPages)].map((_, index) => (
                                    <li
                                        key={index + 1}
                                        className={`page-item ${page === index + 1 ? 'active' : ''}`}
                                    >
                                        <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(page + 1)}>
                                        Next
                                    </button>
                                </li>
                            </ul>
                        </nav>

                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
