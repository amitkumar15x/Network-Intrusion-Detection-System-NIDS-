import React,{useState,useEffect} from "react";
import {AlertTriangle,Trash2,Eye,ShieldAlert,RefreshCw} from "lucide-react";
import {useAuth} from "../context/AuthContext";
import {PacketsAPI} from "../services/api";
import "./Alerts.css";

const Alerts=()=>{

const {token}=useAuth();

const [alerts,setAlerts]=useState([]);
const [loading,setLoading]=useState(true);
const [selectedAlert,setSelectedAlert]=useState(null);

const loadAlerts=async()=>{

setLoading(true);

try{

const res=await PacketsAPI.getAlerts(50);

setAlerts(res.data);

}catch(err){

console.log(err);

}

setLoading(false);

};

useEffect(()=>{

loadAlerts();

},[token]);

const clearAlerts=async()=>{

const ok=window.confirm(
"Delete all alerts?"
);

if(!ok)return;

try{

await PacketsAPI.clearAlerts();

setAlerts([]);
setSelectedAlert(null);

}catch(err){

console.log(err);

}

};

return(

<div className="alerts-view">

<div className="alerts-action-bar">

<div className="bar-title">

<h2>Threat Logs Repository</h2>

<p>
Detected malicious packets and intrusion events.
</p>

</div>

<div className="action-buttons">

<button
className="refresh-btn"
onClick={loadAlerts}
disabled={loading}
>

<RefreshCw
size={15}
className={loading?"spin":""}
/>

<span>Refresh</span>

</button>

<button
className="purge-btn"
onClick={clearAlerts}
>

<Trash2 size={15}/>

<span>Clear</span>

</button>

</div>

</div>

<div className="alerts-layout">

<div className="alerts-table-panel">

<div className="panel-inner">

{

loading?

<div className="alerts-state-loader">

Loading alerts...

</div>

:

alerts.length===0?

<div className="empty-alerts">

<ShieldAlert size={55}/>

<h3>No Alerts</h3>

<p>

No attacks detected.

</p>

</div>

:

<table className="alerts-grid-table">

<thead>

<tr>

<th>ID</th>

<th>Time</th>

<th>Source</th>

<th>Destination</th>

<th>Protocol</th>

<th>Confidence</th>

<th></th>

</tr>

</thead>

<tbody>

{

alerts.map((alert,index)=>(

<tr

key={alert.id||index}

className={
selectedAlert?.id===alert.id
?"active"
:""
}

>

<td>

#{alert.id}

</td>

<td>

{new Date(
alert.timestamp
).toLocaleString()}

</td>

<td>

{alert.src_ip}

</td>

<td>

{alert.dst_ip}

</td>

<td>

{alert.protocol}

</td>

<td>

{Number(
alert.confidence
).toFixed(2)}%

</td>

<td>

<button

className="row-inspect-btn"

onClick={()=>

setSelectedAlert(alert)

}

>

<Eye size={14}/>

</button>

</td>

</tr>

))

}

</tbody>

</table>

}

</div>

</div>
<div className="forensic-inspector">

<div className="forensic-header">

<AlertTriangle size={16}/>

<span>Packet Inspector</span>

</div>

<div className="forensic-body">

{

selectedAlert?

<div className="forensic-card">

<div className="threat-banner">

<ShieldAlert size={18}/>

<span>Threat Details</span>

</div>

<div className="forensic-section">

<span className="section-title">

GENERAL

</span>

<div className="info-row">

<span>ID</span>

<span>#{selectedAlert.id}</span>

</div>

<div className="info-row">

<span>Timestamp</span>

<span>

{new Date(
selectedAlert.timestamp
).toLocaleString()}

</span>

</div>

<div className="info-row">

<span>Prediction</span>

<span>

{selectedAlert.prediction}

</span>

</div>

<div className="info-row">

<span>Confidence</span>

<span>

{Number(
selectedAlert.confidence
).toFixed(2)}%

</span>

</div>

</div>

<div className="forensic-section">

<span className="section-title">

NETWORK

</span>

<div className="info-row">

<span>Source IP</span>

<span>

{selectedAlert.src_ip}

</span>

</div>

<div className="info-row">

<span>Source Port</span>

<span>

{selectedAlert.src_port}

</span>

</div>

<div className="info-row">

<span>Destination IP</span>

<span>

{selectedAlert.dst_ip}

</span>

</div>

<div className="info-row">

<span>Destination Port</span>

<span>

{selectedAlert.dst_port}

</span>

</div>

<div className="info-row">

<span>Protocol</span>

<span>

{selectedAlert.protocol}

</span>

</div>

<div className="info-row">

<span>Packet Size</span>

<span>

{selectedAlert.length} bytes

</span>

</div>

</div>

</div>

:

<div className="forensic-placeholder">

<AlertTriangle size={42}/>

<p>

Select an alert to inspect packet details.

</p>

</div>

}

</div>

</div>

</div>

</div>

);

};

export default Alerts;