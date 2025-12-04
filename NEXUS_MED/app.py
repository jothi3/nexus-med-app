from flask import Flask, render_template, request, session, redirect, jsonify
import razorpay

app = Flask(__name__)
app.secret_key = "nexusmed2025"

# ←←← YOUR RAZORPAY KEYS (get from https://dashboard.razorpay.com/app/keys)
client = razorpay.Client(auth=("YOUR_RAZORPAY_KEY_ID", "YOUR_RAZORPAY_KEY_SECRET"))

# Fake data (same as before)
medicines = [
    {"name":"Dolo 650","price":42},{"name":"Crocin","price":38},{"name":"Azithral 500","price":118},
    {"name":"Liv-52","price":165},{"name":"Saridon","price":45},{"name":"Combiflam","price":65}
]
shops = ["Apollo","MedPlus","Guardian","Netmeds","1mg"]

@app.route('/')
def index():
    cart = session.get('cart', [])
    total = sum(i['price']*i.get('qty',1) for i in cart)
    count = sum(i.get('qty',1) for i in cart)
    return render_template('index.html', medicines=medicines, shops=shops, cart=cart, total=total, count=count)

@app.route('/add', methods=['POST'])
def add():
    data = request.json
    cart = session.get('cart', [])
    for i in cart:
        if i['name'] == data['name']:
            i['qty'] = i.get('qty',1) + 1
            break
    else:
        cart.append({'name':data['name'],'price':data['price'],'qty':1})
    session['cart'] = cart
    return jsonify(success=True)

@app.route('/create_order', methods=['POST'])
def create_order():
    cart = session.get('cart', [])
    if not cart:
        return jsonify(error="Cart empty")
    amount = sum(i['price']*i.get('qty',1) for i in cart) * 100  # in paise
    order = client.order.create({
        "amount": amount,
        "currency": "INR",
        "receipt": "order_rcptid_11"
    })
    return jsonify(order)

@app.route('/success')
def success():
    session['cart'] = []
    return '<h1 style="color:#00ff00;text-align:center;margin-top:200px;font-family:Arial">Payment Successful! Order Placed</h1><script>setTimeout(()=>{location="/"},3000)</script>'

if __name__ == '__main__':
    app.run(debug=True)