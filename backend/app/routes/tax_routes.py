from flask import Blueprint, request, jsonify
from app.services.receipt_scanner import scan_receipt
from app.services.tax_report_generator import generate_tax_report
from app.models.model_utils import predict_deductible
from app.services.tax_optimizer import calculate_user_tax_savings

tax_bp = Blueprint('tax', __name__)

@tax_bp.route("/predict", methods=["POST"])
def predict():
    """Predict if a transaction is deductible."""
    data = request.json["description"]
    is_deductible = predict_deductible(data)
    return jsonify({"deductible": is_deductible})

@tax_bp.route("/scan-receipt", methods=["POST"])
def scan_receipt_route():
    """Scan a receipt and extract text."""
    image_file = request.files["receipt"]
    image_path = f"data/receipts/{image_file.filename}"
    image_file.save(image_path)
    extracted_text = scan_receipt(image_path)
    return jsonify({"extracted_text": extracted_text})

@tax_bp.route("/generate-report", methods=["POST"])
def generate_report():
    """Generate a tax report."""
    report_id = generate_tax_report()
    return jsonify({"report_id": report_id})


@app.route('/generate-tax-report', methods=['POST'])
def generate_tax_report_for_user():
    data = request.json
    user_id = data.get("user_id")
    user_name = data.get("user_name")
    user_transactions = data.get("transactions")  # Expecting a list of transactions

    if not user_id or not user_name or not user_transactions:
        return jsonify({"error": "Missing required fields"}), 400

    report_data = calculate_user_tax_savings(user_id, user_name, user_transactions)

    return jsonify(report_data)