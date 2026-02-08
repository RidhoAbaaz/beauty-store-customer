import styles from '../assets/styles/ProfilePage.module.css';
import Info from '../components/Info/Info';
import NavBar from '../components/Sidebar/NavBar';
import Toolbar from '../components/Toolbar/Toolbar';
import AddressRow from '../components/Row/AddressRow/AddressRow';
import { useContext, useEffect, useState } from 'react';
import AddAddress from '../components/Card/ProfileCard/AddAddress/AddAddress';
import { useNavigate } from 'react-router-dom';
import UpdateAddress from '../components/Card/ProfileCard/UpdateCard/UpdateAddress';
import DeleteCard from '../components/Card/ConfirmCard/DeleteCard';
import { RequestHandler } from '../helper/RequestHandler';
import { BaseUrl } from '../context/BaseUrl';
import LoadingCard from '../components/Card/LoadingCard/LoadingCard';
import ErrorCard from '../components/Card/ErrorCard/ErrorCard';
import SuccessCard from '../components/Card/SuccessCard/SuccessCard';

export default function ProfilePage() {
    const [profile, setProfile] = useState({});

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [view, setView] = useState("");
    const [addressId, setAddressId] = useState("");
    const [refresh, setRefresh] = useState(false);

    const baseUrl = useContext(BaseUrl);

    const navigation = useNavigate();

    const getId = (id, view) => {
        setAddressId(id)
        setView(view);
    }

    const cancelDelete = () => {
        setView("");
        setAddressId(null);
    };

    const handleLogout = () => {
        setLoading(true)
        localStorage.removeItem("token");
        navigation('/login')
    }

    const deleteHandler = async () => {
        setLoading(true);
        setView("")
        try {
            const response = await RequestHandler(`${baseUrl}/address/${addressId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSuccessMessage(response.message);
            setTimeout(() => {
                setSuccessMessage("")
                setRefresh(prev => !prev)
            })
        } catch (error) {
            if (error.message === "token not found") {
                    setErrorMessage(error.message);
                    setTimeout(() => {
                        setErrorMessage("");
                        navigation("/login");
                    }, 3000);
            } else {
                setErrorMessage(error.message);
                setTimeout(() => {
                    setErrorMessage("");
                }, 3000);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await RequestHandler(`${baseUrl}/profile`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setProfile(response.user);
            } catch (error) {
                if (error.message === "token not found") {
                    setErrorMessage(error.message);
                    setTimeout(() => {
                        setErrorMessage("");
                        navigation("/login");
                    }, 3000);
                } else {
                    setErrorMessage(error.message);
                    setTimeout(() => {
                        setErrorMessage("");
                    }, 3000);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [baseUrl, navigation, refresh])

    return (
        <section className={styles.pageLayout}>
            <header className={styles.header}>
                <Toolbar />
                <NavBar />
            </header>
            {
                loading ? <LoadingCard /> : (
                    <main className={styles.mainContent}>
                        <h3 className={styles.title}>My Profile</h3>
                        <Info label="Username" data={profile.name} fontLabel="15px"/>
                        <Info label="Email" data={profile.email}  fontLabel="15px"/>
                        <Info label="Phone Number" data={profile.phone_number}  fontLabel="15px" />
                        <Info label="Status" data={profile.role}  fontLabel="15px" />
                        <div className={styles.addressContainer}>
                            <h3>Address</h3>
                            <div className={styles.addressWrapper}>
                                {
                                    profile.address && profile.address.map(item => 
                                        <AddressRow 
                                            key={item.address_id} 
                                            reveiver={item.receiver} 
                                            address={item.address} 
                                            phoneNumber={item.phone_number}
                                            handler={(view) => getId(item.address_id, view)} />
                                    )
                                }
                            </div>
                            <button className={styles.addBtn} onClick={() => setView("add")}>
                                <p>Add Address</p>
                                <i className="bi bi-house-add"></i>
                            </button>
                            <button className={styles.addBtn} onClick={handleLogout}>
                                <p>Log Out</p>
                                <i class="bi bi-box-arrow-right"></i>
                            </button>
                        </div>
                    </main>
                )
            }
            { view === "add" && 
                <AddAddress 
                    baseUrl={baseUrl} 
                    handler={setView} 
                    setRefresh={setRefresh} 
                    setLoading={setLoading} 
                    setSuccess={setSuccessMessage} 
                    setError={setErrorMessage} /> 
            }
            { view === "update" && 
                <UpdateAddress 
                    baseUrl={baseUrl} 
                    addressId={addressId}
                    handler={setView} 
                    setError={setErrorMessage}
                    setLoading={setLoading}
                    setRefresh={setRefresh}
                    setSuccess={setSuccessMessage} /> 
            }
            { view === "delete" && 
                <DeleteCard 
                    message="Are You Want Delete This Address?"
                    confirmText="Delete"
                    cancelText="Cancel"
                    onConfirm={deleteHandler}
                    onCancel={cancelDelete} 
            />}
            { errorMessage && <ErrorCard message={errorMessage} /> }
            { successMessage && <SuccessCard message={successMessage} /> }
        </section>
    )
}