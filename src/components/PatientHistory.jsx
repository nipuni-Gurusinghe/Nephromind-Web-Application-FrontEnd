import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SidebarDR from './common/SidebarDR';
import './PatientHistory.css';

const PatientHistory = () => {
    const { patientId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const patientName = location.state?.patientName || 'Patient';
    const reportRef = useRef(null);

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5003/admin/doctor/patient-history/${patientId}`
                );
                setHistory(res.data.data || []);
            } catch (err) {
                console.error('Error fetching patient history:', err);
                setError('Failed to load patient history.');
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [patientId]);

    // Format date for display
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    };

    // Prepare data for recharts
    const chartData = history.map((record) => ({
        date: formatDate(record.checkedAtLocal),
        Creatinine: record.lab_cr,
        Potassium: record.lab_k,
        Sodium: record.lab_na,
        Calcium: record.lab_ca,
        Chloride: record.lab_cl,
        Albumin: record.lab_al,
        Uric_Acid: record.lab_ua,
        Protein: record.lab_pr,
    }));

    const latestRecord = history[history.length - 1];

    // PDF Download Handler
    const handleDownloadPDF = async () => {
        if (!reportRef.current) return;
        setDownloading(true);

        try {
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#f4f7f9',
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            // Scale to fit A4 width
            const ratio = pdfWidth / imgWidth;
            const scaledHeight = imgHeight * ratio;

            // Handle multi-page if content is tall
            let position = 0;
            let remainingHeight = scaledHeight;

            while (remainingHeight > 0) {
                pdf.addImage(imgData, 'PNG', 0, position === 0 ? 0 : -(scaledHeight - remainingHeight), pdfWidth, scaledHeight);
                remainingHeight -= pdfHeight;
                if (remainingHeight > 0) {
                    pdf.addPage();
                    position += pdfHeight;
                }
            }

            pdf.save(`Patient_History_${patientName}_${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (err) {
            console.error('PDF generation failed:', err);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="ph-layout">
            <SidebarDR />
            <div className="ph-container">

                {/* Header */}
                <div className="ph-header">
                    <button className="ph-back-btn" onClick={() => navigate(-1)}>
                        ← Back to Appointments
                    </button>
                    <div className="ph-title-block">
                        <h2>Patient Health History</h2>
                        <p className="ph-subtitle">{patientName} — CKD Lab Report Timeline</p>
                    </div>

                    {/* PDF Download Button - only show when data is loaded */}
                    {!loading && !error && history.length > 0 && (
                        <button
                            className="ph-download-btn"
                            onClick={handleDownloadPDF}
                            disabled={downloading}
                        >
                            {downloading ? '⏳ Generating PDF...' : '⬇️ Download PDF'}
                        </button>
                    )}
                </div>

                {/* Loading */}
                {loading && <div className="ph-loading">⏳ Loading patient data...</div>}

                {/* Error */}
                {error && <div className="ph-error">⚠️ {error}</div>}

                {/* No Data */}
                {!loading && !error && history.length === 0 && (
                    <div className="ph-empty">
                        <span>🩺</span>
                        <p>No lab reports found for this patient yet.</p>
                    </div>
                )}

                {/* Data Available - wrapped in ref for PDF capture */}
                {!loading && !error && history.length > 0 && (
                    <div ref={reportRef}>

                        {/* PDF Header (visible in PDF) */}
                        <div className="ph-pdf-header">
                            <h3>NephroMind — Patient Health Report</h3>
                            <p>Patient: <strong>{patientName}</strong> &nbsp;|&nbsp; Generated: {new Date().toLocaleDateString()}</p>
                        </div>

                        {/* Summary Cards */}
                        <div className="ph-summary-cards">
                            <div className="ph-card">
                                <span className="ph-card-label">Total Reports</span>
                                <span className="ph-card-value">{history.length}</span>
                            </div>
                            <div className="ph-card">
                                <span className="ph-card-label">Latest Diagnosis</span>
                                <span className={`ph-card-value ${latestRecord?.hasCkd ? 'ph-val-ckd' : 'ph-val-normal'}`}>
                                    {latestRecord?.diagnosisLabel || '—'}
                                </span>
                            </div>
                            <div className="ph-card">
                                <span className="ph-card-label">Severity</span>
                                <span className={`ph-card-value ph-sev-${latestRecord?.severityCode?.toLowerCase()}`}>
                                    {latestRecord?.severityLabel || '—'}
                                </span>
                            </div>
                            <div className="ph-card">
                                <span className="ph-card-label">Last Checked</span>
                                <span className="ph-card-value ph-card-sm">
                                    {formatDate(latestRecord?.checkedAtLocal)}
                                </span>
                            </div>
                            <div className="ph-card">
                                <span className="ph-card-label">Patient Email</span>
                                <span className="ph-card-value ph-card-sm">
                                    {latestRecord?.userEmail || '—'}
                                </span>
                            </div>
                        </div>

                        {/* Chart 1: Key CKD Markers */}
                        <div className="ph-chart-card">
                            <h3>Key CKD Markers Over Time</h3>
                            <p className="ph-chart-desc">Creatinine & Potassium are primary indicators of kidney function</p>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#edf2f7" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="Creatinine" stroke="#e74c3c" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                                    <Line type="monotone" dataKey="Potassium" stroke="#3498db" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Chart 2: Electrolytes */}
                        <div className="ph-chart-card">
                            <h3>Electrolyte Levels Over Time</h3>
                            <p className="ph-chart-desc">Sodium, Calcium, and Chloride balance tracking</p>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#edf2f7" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="Sodium" stroke="#f39c12" strokeWidth={2} dot={{ r: 5 }} />
                                    <Line type="monotone" dataKey="Calcium" stroke="#9b59b6" strokeWidth={2} dot={{ r: 5 }} />
                                    <Line type="monotone" dataKey="Chloride" stroke="#1abc9c" strokeWidth={2} dot={{ r: 5 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Chart 3: Bar Chart */}
                        <div className="ph-chart-card">
                            <h3>Albumin, Uric Acid & Protein</h3>
                            <p className="ph-chart-desc">Nutritional and metabolic markers per report</p>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#edf2f7" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Albumin" fill="#2ecc71" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Uric_Acid" fill="#e67e22" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="Protein" fill="#2980b9" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Full Report Table */}
                        <div className="ph-chart-card">
                            <h3>Full Report History</h3>
                            <div className="ph-table-scroll">
                                <table className="ph-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Diagnosis</th>
                                            <th>Severity</th>
                                            <th>Creatinine</th>
                                            <th>Potassium</th>
                                            <th>Sodium</th>
                                            <th>Calcium</th>
                                            <th>Chloride</th>
                                            <th>Albumin</th>
                                            <th>Uric Acid</th>
                                            <th>Protein</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((record) => (
                                            <tr key={record.id}>
                                                <td>{formatDate(record.checkedAtLocal)}</td>
                                                <td>
                                                    <span className={`ph-badge ${record.hasCkd ? 'ph-badge-ckd' : 'ph-badge-normal'}`}>
                                                        {record.diagnosisLabel}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`ph-badge ph-sev-${record.severityCode?.toLowerCase()}`}>
                                                        {record.severityLabel}
                                                    </span>
                                                </td>
                                                <td>{record.lab_cr}</td>
                                                <td>{record.lab_k}</td>
                                                <td>{record.lab_na}</td>
                                                <td>{record.lab_ca}</td>
                                                <td>{record.lab_cl}</td>
                                                <td>{record.lab_al}</td>
                                                <td>{record.lab_ua}</td>
                                                <td>{record.lab_pr}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientHistory;
