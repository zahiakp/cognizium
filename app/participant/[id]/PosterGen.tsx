"use client";;
import { toPng } from 'html-to-image';
import { createRoot } from 'react-dom/client';
import { categoryMap } from '../../data/branding';

export const generatePoster = async ({
  result,
  category = 'Senior',
  program = 'Essay Writing',
}: {
  result: any[];
  category: string;
  program:string;
}) => {
  // Create a container for the off-screen element
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.zIndex = '-1';
  document.body.appendChild(container);

  const wrapper = document.createElement('div');
  container.appendChild(wrapper);
  const root = createRoot(wrapper);

  try {
    const imageSrc = `${window.location.origin}/results/result 1.jpg`;

    const CertificateElement = (
      // Using an inline style for width and height is more reliable for html-to-image
      <div id="poster-wrapper" style={{ width: '450px', height: '450px' }}>
        <div className="relative w-full h-full">
          <img
            id="bg-cert"
            src={imageSrc} // Use the direct image source
            alt="Background"
            crossOrigin="anonymous" // Important for loading images in canvas
            className="absolute top-0 left-0 w-full h-full"
          />
          {/* Using absolute positioning with precise values based on the container size */}
          <div className="absolute top-[170px] left-[230px]">
                      <h6 className="text-[18px] font-bold leading-[14px] mb-5 mt-7 w-40 text-white">
                        <p className="text-[8px] font-normal font-Fractul text-white">
                          {categoryMap[category.toString()]}
                        </p>
                        <span className="font-Fractul-medium text-[16px] text-pink-400 font-bold uppercase">
                          {program}
                        </span>
                      </h6>
                    </div>
                    <div className="ml-[35px] absolute top-[205px] left-[190px] mt-[45px] gap-[1px] flex flex-col">
                      {result.filter((rank: any) => rank.rank < 4).map((pro: any) => (
                          <div key={pro.rank} className="flex items-center gap-1 w-50">
                            <p className={`font-Jazri-line text-lg w-5 tracking-tighter font-light text-pink-600`}>
                              0{pro.rank}
                              </p>
                               <div className={`text-white translate-y-[1px]`}>
                              <h6 className="text-[12px] font-Fractul-medium w-50 leading-[16px]">
                                {pro.student.toUpperCase()}
                              </h6>
                              <p className="text-[8px] font-Fractul w-50 -mt-1 leading-[13px]">
                                {pro.campus}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
        </div>
      </div>
    );

    // 1. Render the element and wait for the DOM to update.
    await new Promise<void>((resolve) => {
      requestIdleCallback(() => {
        root.render(CertificateElement);
        setTimeout(resolve, 50); // Give React a moment to update the DOM
      });
    });

    const canvasTarget = wrapper.querySelector('#poster-wrapper') as HTMLElement;
    if (!canvasTarget) {
      throw new Error('Could not find the poster element to capture.');
    }
    
    // --- INSPIRED BY YOUR NEW CODE: Wait for assets after rendering ---
    const bgImg = wrapper.querySelector('#bg-cert') as HTMLImageElement;
    if (!bgImg) {
      throw new Error('Could not find background image element.');
    }
    
    const imageLoadPromise = new Promise((resolve, reject) => {
        // Check if the image is already loaded (e.g., from cache)
        if (bgImg.complete) {
            resolve(true);
        } else {
            bgImg.onload = () => resolve(true);
            bgImg.onerror = () => reject(new Error('Background image failed to load'));
        }
    });

    // Wait for both the image and any custom fonts to be ready
    await Promise.all([imageLoadPromise, document.fonts.ready]);
    
    await new Promise(resolve => setTimeout(resolve, 100)); // Extra delay for final paint

    // Generate the image data URL
    const dataUrl = await toPng(canvasTarget, { 
      pixelRatio: 3, // A value of 3 is a safe high-res choice.
      cacheBust: true,
    });

    // Trigger the download
    const link = document.createElement('a');
    link.download = `${category}_${program}.png`;
    link.href = dataUrl;
    link.click();

  } catch (error) {
    console.error('Poster generation failed:', error);
  } finally {
    // --- Cleanup ---
    // This block ensures that the off-screen elements are always removed
    root.unmount();
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
};

