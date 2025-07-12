import { NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';

export async function POST(request: Request) {
  try {
    const { videoUrl } = await request.json();
    
    if (!videoUrl) {
      return NextResponse.json({ error: 'Video URL is required' }, { status: 400 });
    }

    // Extract video ID
    const videoId = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/)?.[1];
    
    if (!videoId) {
      return NextResponse.json({ error: 'Invalid YouTube URL' }, { status: 400 });
    }

    console.log('🔍 Extracting transcript for video ID:', videoId);

    // Get video info
    const getVideoInfo = async (videoId: string) => {
      try {
        const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
        if (response.ok) {
          const data = await response.json();
          return {
            title: data.title,
            author: data.author_name,
            thumbnail: data.thumbnail_url
          };
        }
      } catch (error) {
        console.log('Could not fetch video info');
      }
      return { title: 'Unknown', author: 'Unknown', thumbnail: null };
    };

    // Method 1: Try youtube-transcript library (simplest)
    try {
      console.log('🔄 Trying youtube-transcript library...');
      const transcriptArray = await YoutubeTranscript.fetchTranscript(videoId);
      
      if (transcriptArray && transcriptArray.length > 0) {
        const transcript = transcriptArray
          .map((item: any) => item.text)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();

        const videoInfo = await getVideoInfo(videoId);
        console.log('✅ SUCCESS with youtube-transcript library');

        return NextResponse.json({
          transcript,
          ...videoInfo,
          videoId,
          success: true,
          wordCount: transcript.split(' ').length,
          method: 'youtube-transcript'
        });
      }
    } catch (error: any) {
      console.log('❌ youtube-transcript failed:', error.message);
    }

    // Method 2: Direct YouTube API approach
    try {
      console.log('🔄 Trying direct YouTube captions API...');
      
      // Try different caption formats
      const captionUrls = [
        `https://www.youtube.com/api/timedtext?v=${videoId}&fmt=srv3&lang=en`,
        `https://www.youtube.com/api/timedtext?v=${videoId}&fmt=vtt&lang=en`,
        `https://www.youtube.com/api/timedtext?v=${videoId}&fmt=srv3`,
        `https://www.youtube.com/api/timedtext?v=${videoId}&fmt=vtt`,
        `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en`,
        `https://www.youtube.com/api/timedtext?v=${videoId}`
      ];

      for (const url of captionUrls) {
        try {
          const response = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });

          if (response.ok) {
            const data = await response.text();
            
            if (data && data.length > 50) { // Minimal content check
              let transcript = '';
              
              // Parse XML format
              if (data.includes('<text')) {
                const textRegex = /<text[^>]*>([^<]+)<\/text>/g;
                const texts = [];
                let textMatch;
                
                while ((textMatch = textRegex.exec(data)) !== null) {
                  const decodedText = textMatch[1]
                    .replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'")
                    .trim();
                  
                  if (decodedText) {
                    texts.push(decodedText);
                  }
                }
                
                transcript = texts.join(' ').replace(/\s+/g, ' ').trim();
              }
              // Parse VTT format
              else if (data.includes('WEBVTT')) {
                const lines = data.split('\n');
                const textLines = lines.filter(line => 
                  line.trim() && 
                  !line.includes('-->') && 
                  !line.includes('WEBVTT') && 
                  !line.match(/^\d+$/)
                );
                transcript = textLines.join(' ').replace(/\s+/g, ' ').trim();
              }
              
              if (transcript && transcript.length > 10) {
                const videoInfo = await getVideoInfo(videoId);
                console.log('✅ SUCCESS with direct API');
                
                return NextResponse.json({
                  transcript,
                  ...videoInfo,
                  videoId,
                  success: true,
                  wordCount: transcript.split(' ').length,
                  method: 'direct-api'
                });
              }
            }
          }
        } catch (urlError) {
          continue; // Try next URL
        }
      }
    } catch (error: any) {
      console.log('❌ Direct API failed:', error.message);
    }

    // Method 3: Scrape YouTube page for caption info
    try {
      console.log('🔄 Trying YouTube page scraping...');
      
      const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (response.ok) {
        const html = await response.text();
        
        // Look for player response
        const playerMatch = html.match(/"playerResponse":"([^"]+)"/);
        if (playerMatch) {
          try {
            const playerDataStr = playerMatch[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
            const playerData = JSON.parse(playerDataStr);
            
            const captionTracks = playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
            
            if (captionTracks && captionTracks.length > 0) {
              for (const track of captionTracks) {
                if (track.baseUrl) {
                  try {
                    const captionResponse = await fetch(track.baseUrl);
                    if (captionResponse.ok) {
                      const captionData = await captionResponse.text();
                      
                      if (captionData.length > 50) {
                        const textRegex = /<text[^>]*>([^<]+)<\/text>/g;
                        const texts = [];
                        let textMatch;
                        
                        while ((textMatch = textRegex.exec(captionData)) !== null) {
                          const decodedText = textMatch[1]
                            .replace(/&amp;/g, '&')
                            .replace(/&lt;/g, '<')
                            .replace(/&gt;/g, '>')
                            .replace(/&quot;/g, '"')
                            .replace(/&#39;/g, "'")
                            .trim();
                          
                          if (decodedText) {
                            texts.push(decodedText);
                          }
                        }
                        
                        if (texts.length > 0) {
                          const transcript = texts.join(' ').replace(/\s+/g, ' ').trim();
                          const videoInfo = await getVideoInfo(videoId);
                          
                          console.log('✅ SUCCESS with page scraping');
                          
                          return NextResponse.json({
                            transcript,
                            ...videoInfo,
                            videoId,
                            success: true,
                            wordCount: transcript.split(' ').length,
                            method: 'page-scraping'
                          });
                        }
                      }
                    }
                  } catch (trackError) {
                    continue;
                  }
                }
              }
            }
          } catch (parseError) {
            console.log('❌ Player data parsing failed');
          }
        }
      }
    } catch (error: any) {
      console.log('❌ Page scraping failed:', error.message);
    }

    // If all methods fail
    const videoInfo = await getVideoInfo(videoId);
    console.log('❌ All methods failed for video:', videoInfo.title);
    
    return NextResponse.json({ 
      error: 'No transcript available for this video',
      videoInfo,
      videoId,
      message: 'This video does not have accessible captions or subtitles.',
      suggestions: [
        'Try a different YouTube video with captions',
        'Look for videos from major channels (TED, BBC, etc.) which usually have captions',
        'Test with: https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      ]
    }, { status: 404 });

  } catch (error: any) {
    console.error('💥 API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch transcript',
      details: error.message
    }, { status: 500 });
  }
}