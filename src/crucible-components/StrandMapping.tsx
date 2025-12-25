import React, { useState } from 'react';
import { useCrucible } from '../CrucibleContext';
import type { StrandMap } from '../crucibleTypes';

const StrandMapping: React.FC = () => {
  const { project, updateStrandMap } = useCrucible();
  const [activeStrand, setActiveStrand] = useState<'quest' | 'fire' | 'constellation'>('quest');

  if (!project) return null;

  const currentStrand = project.strandMaps[activeStrand];

  const handleUpdate = (field: keyof StrandMap, value: any) => {
    updateStrandMap(activeStrand, {
      ...currentStrand,
      [field]: value
    });
  };

  const addKeyMoment = () => {
    const beatNumber = parseInt(prompt('Enter beat number (1-36):') || '0');
    if (beatNumber < 1 || beatNumber > 36) {
      alert('Beat number must be between 1 and 36');
      return;
    }
    const description = prompt('Describe this key moment:') || '';
    if (description) {
      handleUpdate('keyMoments', [...currentStrand.keyMoments, { beatNumber, description }]);
    }
  };

  const removeKeyMoment = (index: number) => {
    handleUpdate(
      'keyMoments',
      currentStrand.keyMoments.filter((_, i) => i !== index)
    );
  };

  const strandInfo = {
    quest: {
      title: 'Quest Strand',
      subtitle: 'External Mission & Objective',
      description: 'The external journey, burden, or mission driving your protagonist through the plot.',
      color: '#c9302c'
    },
    fire: {
      title: 'Fire Strand',
      subtitle: 'Internal Transformation',
      description: 'The internal power, curse, or transformation occurring within your protagonist.',
      color: '#ec971f'
    },
    constellation: {
      title: 'Constellation Strand',
      subtitle: 'Relationships & Community',
      description: 'The web of relationships, alliances, and interpersonal dynamics shaping the story.',
      color: '#5bc0de'
    }
  };

  const info = strandInfo[activeStrand];

  return (
    <div className="strand-mapping">
      <div className="strand-tabs">
        <button
          className={activeStrand === 'quest' ? 'active quest' : 'quest'}
          onClick={() => setActiveStrand('quest')}
        >
          Quest Strand
        </button>
        <button
          className={activeStrand === 'fire' ? 'active fire' : 'fire'}
          onClick={() => setActiveStrand('fire')}
        >
          Fire Strand
        </button>
        <button
          className={activeStrand === 'constellation' ? 'active constellation' : 'constellation'}
          onClick={() => setActiveStrand('constellation')}
        >
          Constellation Strand
        </button>
      </div>

      <div className="strand-content">
        <div className="strand-header" style={{ borderLeftColor: info.color }}>
          <h2>{info.title}</h2>
          <p className="subtitle">{info.subtitle}</p>
          <p className="description">{info.description}</p>
        </div>

        <div className="strand-section">
          <h3>Summary</h3>
          <textarea
            value={currentStrand.summary}
            onChange={(e) => handleUpdate('summary', e.target.value)}
            placeholder={`Describe the ${activeStrand} strand in 2-3 sentences...`}
            rows={4}
          />
        </div>

        <div className="strand-section">
          <h3>Arc Progression</h3>
          <p className="section-help">
            Break down how this strand develops through your story
          </p>
          {currentStrand.arc.map((phase, index) => (
            <div key={index} className="arc-phase">
              <textarea
                value={phase}
                onChange={(e) => {
                  const newArc = [...currentStrand.arc];
                  newArc[index] = e.target.value;
                  handleUpdate('arc', newArc);
                }}
                placeholder={`Phase ${index + 1}...`}
                rows={2}
              />
              <button
                onClick={() => {
                  const newArc = currentStrand.arc.filter((_, i) => i !== index);
                  handleUpdate('arc', newArc);
                }}
                className="delete-btn"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            onClick={() => handleUpdate('arc', [...currentStrand.arc, ''])}
            className="add-btn"
          >
            + Add Phase
          </button>
        </div>

        <div className="strand-section">
          <h3>Key Moments</h3>
          <p className="section-help">
            Define crucial moments in this strand, linked to specific beats
          </p>
          {currentStrand.keyMoments
            .sort((a, b) => a.beatNumber - b.beatNumber)
            .map((moment, index) => (
              <div key={index} className="key-moment">
                <div className="moment-header">
                  <strong>Beat {moment.beatNumber}</strong>
                  <button onClick={() => removeKeyMoment(index)} className="delete-btn-small">
                    ✕
                  </button>
                </div>
                <p>{moment.description}</p>
              </div>
            ))}
          <button onClick={addKeyMoment} className="add-btn">
            + Add Key Moment
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrandMapping;
