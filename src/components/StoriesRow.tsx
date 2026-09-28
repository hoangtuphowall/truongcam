import React from 'react';
import { Plus } from 'lucide-react';
import { Story, Person, UserProfile } from '../types';

interface StoriesRowProps {
  stories: Story[];
  people: Person[];
  user: UserProfile;
  onOpenStory: (storyId: number) => void;
  onAddStory: () => void;
}

export const StoriesRow: React.FC<StoriesRowProps> = ({
  stories,
  people,
  user,
  onOpenStory,
  onAddStory
}) => {
  const getPerson = (id: number) => people.find((p) => p.id === id);
  const userStory = stories.find((s) => s.personId === 0 && s.slides.length > 0);
  const friendStories = stories.filter((s) => s.personId !== 0);

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-3 px-4 flex items-center gap-3.5 select-none">
      {/* Your Story Button */}
      <div className="flex flex-col items-center gap-1.5 shrink-0 group">
        <div className="relative w-16 h-16">
          <button
            onClick={() => {
              if (userStory) {
                onOpenStory(userStory.id);
              } else {
                onAddStory();
              }
            }}
            className={`w-16 h-16 rounded-full p-[2.5px] transition-all flex items-center justify-center cursor-pointer ${
              userStory
                ? 'bg-gradient-to-tr from-[#ff6bcb] via-[#ffb84d] to-[#7c6bff] shadow-lg shadow-purple-500/25 hover:scale-105'
                : 'border border-white/20 group-hover:border-purple-400/60'
            }`}
            aria-label={userStory ? 'View your story' : 'Add to your story'}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center text-xl font-bold text-white shadow-inner border border-[#150d26]/80 overflow-hidden"
              style={{ background: user.avatarGradient }}
            >
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.emoji
              )}
            </div>
          </button>

          {/* Plus Add Button Pill */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddStory();
            }}
            className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-gradient-to-r from-[#7c6bff] to-[#ff6bcb] flex items-center justify-center text-white border-2 border-[#150d26] shadow-sm hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            title="Add a new story slide"
            aria-label="Add slide"
          >
            <Plus className="w-3 h-3 stroke-[3]" />
          </button>
        </div>
        <span className="text-[11.5px] font-semibold text-white/80 group-hover:text-white truncate max-w-[68px]">
          {userStory ? 'Your story' : 'Add story'}
        </span>
      </div>

      {/* Friends Stories */}
      {friendStories.map((story) => {
        const person = getPerson(story.personId);
        if (!person) return null;

        return (
          <button
            key={story.id}
            onClick={() => onOpenStory(story.id)}
            className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
            aria-label={`View story by ${person.name}`}
          >
            <div
              className={`w-16 h-16 rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-105 ${
                story.seen
                  ? 'border border-white/25'
                  : 'bg-gradient-to-tr from-[#ff6bcb] via-[#ffb84d] to-[#7c6bff] shadow-lg shadow-purple-500/20'
              }`}
            >
              <div
                className="w-full h-full rounded-full flex items-center justify-center text-2xl font-bold border-2 border-[#150d26]/80 text-white shadow-inner overflow-hidden"
                style={{ background: person.avatarGradient }}
              >
                {person.avatarUrl ? (
                  <img src={person.avatarUrl} alt={person.name} className="w-full h-full object-cover" />
                ) : (
                  person.emoji
                )}
              </div>
            </div>
            <span className="text-[11.5px] font-medium text-white/70 group-hover:text-white truncate max-w-[68px]">
              {person.name.split(' ')[0]}
            </span>
          </button>
        );
      })}
    </div>
  );
};
