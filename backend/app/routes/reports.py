from flask import Blueprint, Response, jsonify

from app.services.report_service import ReportService
from app.utils.security import login_required

report_bp = Blueprint("reports", __name__)


@report_bp.route("/summary", methods=["GET"])
@login_required
def report_summary():
    """
    Returns report summary for dashboard/reports page
    """
    return jsonify(
        ReportService.generate_summary()
    )


@report_bp.route("/download", methods=["GET"])
@login_required
def download_report():
    """
    Downloads packet history as CSV
    """

    csv_data = ReportService.generate_csv_report()

    return Response(
        csv_data,
        mimetype="text/csv",
        headers={
            "Content-Disposition": "attachment; filename=network_intrusion_report.csv",
            "Cache-Control": "no-cache"
        }
    )