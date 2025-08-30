import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, platform, tone = "professional", length = "medium" } = body

    if (!prompt || !platform) {
      return NextResponse.json({ success: false, error: "Prompt and platform are required" }, { status: 400 })
    }

    // Simulate AI content generation delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock generated content based on platform
    const platformContent = {
      facebook: {
        content: `🚀 ${prompt}\n\nDiscover how our innovative solutions can transform your business! Join thousands of satisfied customers who have already made the switch.\n\n#Innovation #Business #Growth #Success`,
        hashtags: ["#Innovation", "#Business", "#Growth", "#Success"],
        suggestedImages: ["/placeholder.jpg"],
      },
      instagram: {
        content: `✨ ${prompt}\n\n📸 Swipe to see the magic happen!\n\n#InstaGood #Business #Lifestyle #Motivation #Success #Growth #Innovation #Trending`,
        hashtags: [
          "#InstaGood",
          "#Business",
          "#Lifestyle",
          "#Motivation",
          "#Success",
          "#Growth",
          "#Innovation",
          "#Trending",
        ],
        suggestedImages: ["/placeholder.jpg", "/placeholder.jpg"],
      },
      twitter: {
        content: `🔥 ${prompt}\n\nThe future is here! 🚀\n\n#Tech #Innovation #Business`,
        hashtags: ["#Tech", "#Innovation", "#Business"],
        suggestedImages: ["/placeholder.jpg"],
      },
      linkedin: {
        content: `${prompt}\n\nIn today's competitive landscape, businesses need innovative solutions to stay ahead. Our platform provides the tools and insights necessary for sustainable growth.\n\nWhat strategies have worked best for your business? Share your thoughts in the comments.\n\n#BusinessStrategy #Innovation #Growth #Leadership`,
        hashtags: ["#BusinessStrategy", "#Innovation", "#Growth", "#Leadership"],
        suggestedImages: ["/placeholder.jpg"],
      },
    }

    const generatedContent = platformContent[platform as keyof typeof platformContent] || platformContent.facebook

    return NextResponse.json({
      success: true,
      data: {
        content: generatedContent.content,
        hashtags: generatedContent.hashtags,
        suggestedImages: generatedContent.suggestedImages,
        platform,
        tone,
        length,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to generate content" }, { status: 500 })
  }
}
