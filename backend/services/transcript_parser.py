import re

def parse_raw_transcript(text: str) -> list[dict]:
    """
    Parses a raw transcript text into structured segments.
    Expects formats similar to:
    Speaker Name (00:00):
    This is what they said.

    or simply:
    Speaker Name: This is what they said.

    Returns a list of dictionaries with speaker, start_time, end_time, and text.
    """
    segments = []
    
    # Simple regex to catch "Speaker (MM:SS): Text" or "Speaker: Text"
    # This is a naive parser for demonstration
    lines = text.strip().split('\n')
    
    current_speaker = "Unknown"
    current_text = []
    current_time = 0.0
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Check for Speaker (MM:SS): or Speaker:
        match = re.match(r'^([^:]+?)(?:\s*\((\d+):(\d+)\))?:\s*(.*)$', line)
        if match:
            # Save previous segment if exists
            if current_text:
                segments.append({
                    "speaker": current_speaker,
                    "start_time": current_time,
                    "end_time": current_time + 15.0, # Mock end time
                    "text": " ".join(current_text)
                })
            
            speaker = match.group(1).strip()
            mins = match.group(2)
            secs = match.group(3)
            spoken = match.group(4).strip()
            
            current_speaker = speaker
            if mins and secs:
                current_time = float(mins) * 60 + float(secs)
            else:
                current_time += 15.0 # Just increment if no time provided
                
            current_text = [spoken] if spoken else []
        else:
            # Continuation of previous speaker
            current_text.append(line)
            
    # Add the last segment
    if current_text:
        segments.append({
            "speaker": current_speaker,
            "start_time": current_time,
            "end_time": current_time + 15.0,
            "text": " ".join(current_text)
        })
        
    return segments
