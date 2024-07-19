#!/usr/bin/python3

from flask import Flask, url_for, render_template


app = Flask(__name__)

@app.errorhandler(404)
def not_found():
    return render_template("404.html"), 404


@app.route("/", strict_slashes=False)
def index():
    return render_template("index.html")


'''
if __name__ == "__main__":
    app.run(port=5000, host="0.0.0.0");
'''
