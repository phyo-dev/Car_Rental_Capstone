import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const AgencyVerificationForm = () => {
    const { authData } = useAuth();
    const [formData, setFormData] = useState({
        agencyId: authData?.user?.id || '',
        nrc: '',
        nrcPhotoFront: null,
        nrcPhotoBack: null,
        agencyLicenseFront: null,
        agencyLicenseBack: null,
    });
    const [verification, setVerification] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchVerification = async () => {
            if (!authData?.user?.id) {
                setError('No agency ID available. Please log in.');
                return;
            }
            try {
                setLoading(true);
                setError(null);
                const response = await axiosInstance.get(`/agency/verification/${authData.user.id}`);
                const verificationData = response.data;
                setVerification(verificationData);
                setIsVerified(verificationData?.verificationStatus === 'VERIFIED');
                setFormData((prev) => ({
                    ...prev,
                    nrc: verificationData?.nrc || '',
                }));

                switch (verificationData?.verificationStatus) {
                    case 'VERIFIED':
                        setSuccess('Your account is verified.');
                        break;
                    case 'PENDING':
                        setError('Your data is under review! Please wait!');
                        break;
                    case 'REUPLOAD':
                        setError('You need to reupload your verification data!');
                        break;
                    default:
                        setError('You have not submitted verification data yet.');
                }
            } catch (error) {
                console.error('Error fetching verification:', error);
                setError(error.response?.data?.message || 'You have not submitted verification data yet.');
            } finally {
                setLoading(false);
            }
        };
        fetchVerification();
    }, [authData?.user?.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, [field]: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isVerified) {
            setError('Cannot modify verified verification data.');
            return;
        }

        if (!formData.nrc || !formData.nrcPhotoFront || !formData.nrcPhotoBack || 
            !formData.agencyLicenseFront || !formData.agencyLicenseBack) {
            setError('Please fill in all required fields.');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            const formDataToSend = new FormData();
            const agencyId = Number(authData?.user?.id);
            if (isNaN(agencyId)) {
                throw new Error('Invalid agency ID');
            }
            formDataToSend.append('agencyId', agencyId);
            formDataToSend.append('nrc', formData.nrc);
            formDataToSend.append('nrcPhotoFront', formData.nrcPhotoFront);
            formDataToSend.append('nrcPhotoBack', formData.nrcPhotoBack);
            formDataToSend.append('agencyLicenseFront', formData.agencyLicenseFront);
            formDataToSend.append('agencyLicenseBack', formData.agencyLicenseBack);

            const response = await axiosInstance.post('/agency/verification/upload', formDataToSend);
            setVerification(response.data);
            setIsVerified(response.data?.verificationStatus === 'VERIFIED');
            setSuccess('Verification data uploaded successfully.');
            setFormData((prev) => ({
                ...prev,
                nrcPhotoFront: null,
                nrcPhotoBack: null,
                agencyLicenseFront: null,
                agencyLicenseBack: null,
            }));
            document.getElementById('nrcPhotoFront').value = null;
            document.getElementById('nrcPhotoBack').value = null;
            document.getElementById('agencyLicenseFront').value = null;
            document.getElementById('agencyLicenseBack').value = null;
        } catch (error) {
            console.error('Error updating verification:', error);
            setError(error.response?.data?.message || 'Failed to upload verification data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="agency-verification-form">
            <h2>Agency Verification</h2>
            {loading && <p className="alert alert-info">Loading...</p>}
            {error && <p className="alert alert-danger">{error}</p>}
            {success && <p className="alert alert-success">{success}</p>}

            {verification && (
                <div className="verification-details">
                    <h3>Current Verification Data</h3>
                    <p><strong>NRC:</strong> {verification.nrc}</p>
                    {verification.nrcPhotoFront && (
                        <div>
                            <p><strong>NRC Photo Front:</strong></p>
                            <img src={`data:image/jpeg;base64,${verification.nrcPhotoFront}`} alt="NRC Front" width="150" />
                        </div>
                    )}
                    {verification.nrcPhotoBack && (
                        <div>
                            <p><strong>NRC Photo Back:</strong></p>
                            <img src={`data:image/jpeg;base64,${verification.nrcPhotoBack}`} alt="NRC Back" width="150" />
                        </div>
                    )}
                    {verification.agencyLicenseFront && (
                        <div>
                            <p><strong>Agency License Front:</strong></p>
                            <img src={`data:image/jpeg;base64,${verification.agencyLicenseFront}`} alt="License Front" width="150" />
                        </div>
                    )}
                    {verification.agencyLicenseBack && (
                        <div>
                            <p><strong>Agency License Back:</strong></p>
                            <img src={`data:image/jpeg;base64,${verification.agencyLicenseBack}`} alt="License Back" width="150" />
                        </div>
                    )}
                </div>
            )}

            {!isVerified && (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nrc">NRC Number:</label>
                        <input
                            id="nrc"
                            type="text"
                            name="nrc"
                            value={formData.nrc}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="form-control"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nrcPhotoFront">NRC Photo Front:</label>
                        <input
                            id="nrcPhotoFront"
                            type="file"
                            name="nrcPhotoFront"
                            onChange={(e) => handleFileChange(e, 'nrcPhotoFront')}
                            required={!verification?.nrcPhotoFront}
                            disabled={loading}
                            className="form-control"
                            accept="image/*"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nrcPhotoBack">NRC Photo Back:</label>
                        <input
                            id="nrcPhotoBack"
                            type="file"
                            name="nrcPhotoBack"
                            onChange={(e) => handleFileChange(e, 'nrcPhotoBack')}
                            required={!verification?.nrcPhotoBack}
                            disabled={loading}
                            className="form-control"
                            accept="image/*"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="agencyLicenseFront">Agency License Front:</label>
                        <input
                            id="agencyLicenseFront"
                            type="file"
                            name="agencyLicenseFront"
                            onChange={(e) => handleFileChange(e, 'agencyLicenseFront')}
                            required={!verification?.agencyLicenseFront}
                            disabled={loading}
                            className="form-control"
                            accept="image/*"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="agencyLicenseBack">Agency License Back:</label>
                        <input
                            id="agencyLicenseBack"
                            type="file"
                            name="agencyLicenseBack"
                            onChange={(e) => handleFileChange(e, 'agencyLicenseBack')}
                            required={!verification?.agencyLicenseBack}
                            disabled={loading}
                            className="form-control"
                            accept="image/*"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        {loading ? 'Uploading...' : 'Upload/Update Verification'}
                    </button>
                </form>
            )}

            <style jsx>{`
                .agency-verification-form {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background: #f9f9f9;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    margin-bottom: 2rem;
                }

                h2 {
                    color: #333;
                    text-align: center;
                    margin-bottom: 20px;
                }

                .verification-details {
                    margin-bottom: 20px;
                    padding: 15px;
                    background: #fff;
                    border-radius: 4px;
                }

                .verification-details h3 {
                    color: #444;
                    margin-bottom: 15px;
                }

                .verification-details p {
                    margin: 10px 0;
                    color: #666;
                }

                .verification-details img {
                    display: block;
                    margin: 10px 0;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }

                .form-group {
                    margin-bottom: 15px;
                }

                label {
                    display: block;
                    margin-bottom: 5px;
                    color: #555;
                    font-weight: 500;
                }

                .form-control {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                }

                .form-control:disabled {
                    background: #eee;
                    cursor: not-allowed;
                }

                .btn {
                    display: block; 
                    width: auto; 
                    margin: 0 auto; /* Center the block element */
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background 0.3s;
                    
                   
                }

                .btn-primary {
                    background:rgb(48, 48, 11);
                    color: white;
                }

                .btn-primary:hover:not(:disabled) {
                    background:rgb(245, 210, 8);
                    color: black;
                }

                .btn:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }

                .alert {
                    padding: 10px;
                    margin-bottom: 15px;
                    border-radius: 4px;
                }

                .alert-info {
                    background: #d1ecf1;
                    color: #0c5460;
                }

                .alert-danger {
                    background: #f8d7da;
                    color: #721c24;
                }

                .alert-success {
                    background: #d4edda;
                    color: #155724;
                }
            `}</style>
        </div>
    );
};

export default AgencyVerificationForm;