from flask import Flask, request, jsonify
from main import youtube_audio_downloader, transcribe, summarize

app = Flask(__name__)


@app.route('/api/transcribe', methods=['POST'])
def transcribe_audio():
    data = request.get_json()
    youtube_link = data.get('youtube_link')

    downloaded_audio_file = youtube_audio_downloader(youtube_link)
    transcribed_file = transcribe(downloaded_audio_file, not_english=False)
    summary = summarize(transcribed_file)

    return jsonify({"summary": summary})


@app.route('/')
def hello():
    return 'Hello, World!'


if __name__ == '__main__':
    app.run()
