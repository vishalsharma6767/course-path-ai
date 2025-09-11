import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { careerTitle, category, userProfile } = await req.json();

    console.log(`Generating detailed roadmap for: ${careerTitle}`);

    let detailedRoadmap;

    if (openAIApiKey) {
      try {
        console.log('Attempting OpenAI API call...');
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openAIApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are an expert career counselor creating detailed, personalized career roadmaps. Provide comprehensive, actionable guidance with specific timelines, skills, resources, and milestones. Format your response as a structured JSON object with the following sections: timeline, skills, resources, certifications, networking, salary_progression, challenges, and tips.`
              },
              {
                role: 'user',
                content: `Create a detailed career roadmap for "${careerTitle}" in the ${category} field. Include:
                1. Month-by-month timeline for first 2 years
                2. Key skills to develop at each stage
                3. Specific resources (courses, books, websites)
                4. Important certifications and when to get them
                5. Networking strategies
                6. Expected salary progression
                7. Common challenges and how to overcome them
                8. Pro tips from industry experts
                
                User Profile: ${JSON.stringify(userProfile || 'Not provided')}
                
                Make it practical, specific, and actionable for Indian students/professionals.`
              }
            ],
            max_tokens: 2000,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          try {
            detailedRoadmap = JSON.parse(data.choices[0].message.content);
            console.log('AI roadmap generated successfully');
          } catch (parseError) {
            console.log('Failed to parse AI response as JSON, using as text');
            detailedRoadmap = {
              content: data.choices[0].message.content,
              generated_by: 'AI'
            };
          }
        } else {
          throw new Error(`OpenAI API error: ${response.status}`);
        }
      } catch (error) {
        console.error('OpenAI error, using intelligent fallback:', error.message);
        detailedRoadmap = generateFallbackRoadmap(careerTitle, category);
      }
    } else {
      console.log('No OpenAI API key, using intelligent fallback');
      detailedRoadmap = generateFallbackRoadmap(careerTitle, category);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      roadmap: detailedRoadmap,
      career: careerTitle,
      category 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-detailed-roadmap function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateFallbackRoadmap(careerTitle: string, category: string) {
  const roadmaps: Record<string, any> = {
    "Software Engineer": {
      timeline: {
        "Month 1-3": "Learn programming fundamentals (Python/Java), practice data structures",
        "Month 4-6": "Build 2-3 projects, learn version control (Git), basic web development",
        "Month 7-9": "Choose specialization (web/mobile/AI), advanced algorithms",
        "Month 10-12": "Internship preparation, system design basics, portfolio development",
        "Month 13-18": "Internship experience, contribute to open source",
        "Month 19-24": "Job applications, interview preparation, networking"
      },
      skills: [
        "Programming Languages (Python, Java, JavaScript)",
        "Data Structures & Algorithms",
        "System Design",
        "Database Management",
        "Web Development",
        "Version Control (Git)",
        "Cloud Computing (AWS/Azure)",
        "DevOps Basics"
      ],
      resources: [
        "LeetCode for coding practice",
        "GeeksforGeeks for concepts",
        "Coursera Programming Courses",
        "YouTube channels: CodeWithHarry, Apna College",
        "Books: Clean Code, System Design Interview"
      ],
      certifications: [
        "AWS Cloud Practitioner (Month 12)",
        "Oracle Java Certification (Month 8)",
        "Google Cloud Associate (Month 18)"
      ],
      networking: [
        "Join tech communities (Reddit, Stack Overflow)",
        "Attend local meetups and hackathons",
        "Connect with seniors on LinkedIn",
        "Participate in coding competitions"
      ],
      salary_progression: {
        "Entry Level (0-2 years)": "₹3-8 LPA",
        "Mid Level (2-5 years)": "₹8-18 LPA",
        "Senior Level (5+ years)": "₹18-35 LPA"
      },
      challenges: [
        "Keeping up with rapidly changing technology",
        "Imposter syndrome in early career",
        "Interview preparation stress"
      ],
      tips: [
        "Focus on problem-solving, not just syntax",
        "Build projects that solve real problems",
        "Contribute to open source regularly",
        "Practice system design interviews"
      ]
    },
    "Doctor (MBBS)": {
      timeline: {
        "Month 1-6": "NEET preparation intensification, biology and chemistry focus",
        "Month 7-12": "NEET exam, medical college admission process",
        "Month 13-18": "First year MBBS - anatomy, physiology basics",
        "Month 19-24": "Continue pre-clinical subjects, develop study habits"
      },
      skills: [
        "Medical Knowledge Base",
        "Clinical Examination",
        "Patient Communication",
        "Emergency Response",
        "Medical Ethics",
        "Research Methodology"
      ],
      resources: [
        "Harrison's Principles of Internal Medicine",
        "Gray's Anatomy",
        "NEET preparation materials",
        "Medical journals and publications",
        "Clinical rotation opportunities"
      ],
      certifications: [
        "NEET UG (For admission)",
        "Medical Council licensing",
        "Specialty board certifications"
      ],
      networking: [
        "Medical conferences and seminars",
        "Healthcare professional associations",
        "Hospital volunteer opportunities",
        "Medical college alumni networks"
      ],
      salary_progression: {
        "Intern": "₹15,000-30,000/month",
        "Junior Doctor": "₹3-6 LPA",
        "Specialist": "₹8-25 LPA",
        "Senior Consultant": "₹25-50+ LPA"
      },
      challenges: [
        "Long study hours and academic pressure",
        "Emotional stress of patient care",
        "High competition for specializations"
      ],
      tips: [
        "Develop strong foundational knowledge",
        "Practice clinical skills regularly",
        "Maintain work-life balance",
        "Stay updated with medical advances"
      ]
    }
  };

  return roadmaps[careerTitle] || {
    timeline: {
      "Month 1-6": "Foundation building and skill development",
      "Month 7-12": "Practical experience and portfolio building",
      "Month 13-18": "Advanced learning and specialization",
      "Month 19-24": "Professional networking and career preparation"
    },
    skills: ["Industry-specific technical skills", "Communication", "Problem-solving", "Leadership"],
    resources: ["Online courses", "Industry publications", "Professional networks", "Mentorship programs"],
    certifications: ["Industry-standard certifications", "Professional licenses"],
    networking: ["Professional associations", "Industry events", "Online communities"],
    salary_progression: {
      "Entry Level": "₹3-8 LPA",
      "Mid Level": "₹8-18 LPA",
      "Senior Level": "₹18+ LPA"
    },
    challenges: ["Market competition", "Skill gap", "Career transitions"],
    tips: ["Continuous learning", "Build strong network", "Focus on practical skills"]
  };
}