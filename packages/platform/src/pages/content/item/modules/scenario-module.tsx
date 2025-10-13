import { useCustomToast } from "@/hooks/use-toast-custom";
import type { Content, ContentItem } from "@/providers/content-provider";
import { 
  FileText, 
  Play, 
  Clock, 
  Users, 
  MessageSquare, 
  MapPin, 
  Calendar, 
  BarChart3,
  Edit3,
  Plus,
  ChevronRight,
  Camera,
  Mic,
  Settings,
  GitBranch,
  History,
  Download
} from "lucide-react";
import { useState } from "react";

interface ScenarioModuleProps {
  item: ContentItem;
  content: Content;
}

export function ScenarioModule({ item, content }: ScenarioModuleProps) {
  const { showDevelopmentToast } = useCustomToast();
  const [activeTab, setActiveTab] = useState<'scenes' | 'characters' | 'versions'>('scenes');
  const [selectedScene, setSelectedScene] = useState<number>(0);

  // Mock data for Scenario
  const mockData = {
    title: "Jak założyć własną firmę - Poradnik dla początkujących",
    version: "v1.2",
    totalDuration: "12:45",
    status: "in_production",
    lastModified: "2024-01-21T15:30:00Z",
    scenes: [
      {
        id: 1,
        title: "Wprowadzenie",
        duration: "1:30",
        location: "Biuro domowe",
        description: "Powitanie widzów i przedstawienie tematu odcinka",
        dialogue: "Cześć! Jestem Anna i dziś opowiem wam, jak krok po kroku założyć własną firmę. To może być początkiem waszej przedsiębiorczej przygody!",
        cameraAngles: ["Close-up", "Medium shot"],
        props: ["Laptop", "Notatki", "Kubek kawy"],
        notes: "Mówić z uśmiechem, utrzymywać kontakt wzrokowy z kamerą"
      },
      {
        id: 2,
        title: "Wybór formy prawnej",
        duration: "3:15",
        location: "Biuro domowe",
        description: "Omówienie różnych form prawnych działalności",
        dialogue: "Pierwsza ważna decyzja to wybór formy prawnej. Mamy kilka opcji: działalność gospodarcza, spółka cywilna, spółka z o.o...",
        cameraAngles: ["Medium shot", "Close-up na notatki"],
        props: ["Tableta z wykresem", "Dokumenty"],
        notes: "Pokazać wykres porównujący formy prawne"
      },
      {
        id: 3,
        title: "Rejestracja firmy",
        duration: "2:45",
        location: "Przy komputerze",
        description: "Proces rejestracji firmy krok po kroku",
        dialogue: "Teraz pokażę wam, jak zarejestrować firmę online. Wchodzimy na stronę CEIDG...",
        cameraAngles: ["Screen recording", "Over-shoulder"],
        props: ["Komputer", "Dokumenty"],
        notes: "Nagrać screen z procesu rejestracji"
      }
    ],
    characters: [
      {
        name: "Anna Kowalska",
        role: "Prowadzący",
        description: "Ekspert ds. przedsiębiorczości",
        costume: "Business casual - bluzka i marynarka",
        makeup: "Naturalny makijaż, podkreślone oczy"
      }
    ],
    versions: [
      {
        version: "v1.2",
        date: "2024-01-21T15:30:00Z",
        changes: "Dodano scenę o rejestracji online",
        author: "Anna K.",
        status: "current"
      },
      {
        version: "v1.1",
        date: "2024-01-20T10:15:00Z",
        changes: "Poprawiono dialogue w scenie 2",
        author: "Anna K.",
        status: "archived"
      },
      {
        version: "v1.0",
        date: "2024-01-19T14:00:00Z",
        changes: "Pierwsza wersja scenariusza",
        author: "Anna K.",
        status: "archived"
      }
    ],
    equipment: {
      cameras: ["Sony A7 III", "iPhone 14 Pro (backup)"],
      audio: ["Rode VideoMic Pro", "Lavalier mic"],
      lighting: ["Softbox", "Ring light", "Natural light"]
    }
  };

  const tabs = [
    { id: 'scenes', label: 'Sceny', icon: Play },
    { id: 'characters', label: 'Postacie', icon: Users },
    { id: 'versions', label: 'Wersje', icon: GitBranch }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex space-x-1 p-1 bg-gray-100 rounded-xl mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'scenes' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Scene List */}
            <div className="lg:col-span-1">
              <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-4 h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Sceny</h3>
                  <button 
                    onClick={showDevelopmentToast}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {mockData.scenes.map((scene, index) => (
                    <button
                      key={scene.id}
                      onClick={() => setSelectedScene(index)}
                      className={`w-full p-3 rounded-xl text-left transition-all ${
                        selectedScene === index 
                          ? 'bg-blue-100 border border-blue-300' 
                          : 'bg-white/60 hover:bg-white/80 border border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{scene.title}</span>
                        <span className="text-xs text-gray-500">{scene.duration}</span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{scene.description}</p>
                    </button>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Całkowity czas:</span>
                    <span className="font-medium text-gray-900">{mockData.totalDuration}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scene Detail */}
            <div className="lg:col-span-2">
              <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6 h-full">
                {mockData.scenes[selectedScene] && (
                  <div className="space-y-6">
                    {/* Scene Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          {mockData.scenes[selectedScene].title}
                        </h2>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{mockData.scenes[selectedScene].duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{mockData.scenes[selectedScene].location}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={showDevelopmentToast}
                        className="p-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/80 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Opis sceny</label>
                      <textarea 
                        defaultValue={mockData.scenes[selectedScene].description}
                        rows={2}
                        className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Dialogue */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dialog</label>
                      <textarea 
                        defaultValue={mockData.scenes[selectedScene].dialogue}
                        rows={4}
                        className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Technical Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ujęcia kamery</label>
                        <div className="space-y-2">
                          {mockData.scenes[selectedScene].cameraAngles.map((angle, index) => (
                            <div key={index} className="flex items-center space-x-2 px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg">
                              <Camera className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">{angle}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rekwizyty</label>
                        <div className="space-y-2">
                          {mockData.scenes[selectedScene].props.map((prop, index) => (
                            <div key={index} className="flex items-center space-x-2 px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg">
                              <Settings className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">{prop}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Director Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notatki reżysera</label>
                      <textarea 
                        defaultValue={mockData.scenes[selectedScene].notes}
                        rows={3}
                        className="w-full px-3 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Dodaj notatki dla realizacji sceny..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'characters' && (
          <div className="space-y-6">
            {/* Characters Overview */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Postacie</h3>
                <button 
                  onClick={showDevelopmentToast}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Dodaj postać</span>
                </button>
              </div>
              <div className="space-y-4">
                {mockData.characters.map((character, index) => (
                  <div key={index} className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{character.name}</h4>
                        <p className="text-sm text-blue-600">{character.role}</p>
                      </div>
                      <button 
                        onClick={showDevelopmentToast}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{character.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Kostium</span>
                        <p className="text-sm text-gray-900">{character.costume}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Makijaż</span>
                        <p className="text-sm text-gray-900">{character.makeup}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sprzęt techniczny</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                    <Camera className="w-4 h-4" />
                    <span>Kamery</span>
                  </h4>
                  <ul className="space-y-2">
                    {mockData.equipment.cameras.map((camera, index) => (
                      <li key={index} className="text-sm text-gray-600">{camera}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                    <Mic className="w-4 h-4" />
                    <span>Audio</span>
                  </h4>
                  <ul className="space-y-2">
                    {mockData.equipment.audio.map((audio, index) => (
                      <li key={index} className="text-sm text-gray-600">{audio}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                    <Settings className="w-4 h-4" />
                    <span>Oświetlenie</span>
                  </h4>
                  <ul className="space-y-2">
                    {mockData.equipment.lighting.map((light, index) => (
                      <li key={index} className="text-sm text-gray-600">{light}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'versions' && (
          <div className="space-y-6">
            {/* Version History */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Historia wersji</h3>
                <button 
                  onClick={showDevelopmentToast}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/80 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Eksportuj</span>
                </button>
              </div>
              <div className="space-y-3">
                {mockData.versions.map((version, index) => (
                  <div key={index} className={`p-4 rounded-xl border ${
                    version.status === 'current' 
                      ? 'border-blue-200 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          version.status === 'current' ? 'bg-blue-500' : 'bg-gray-400'
                        }`} />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-900">{version.version}</span>
                            {version.status === 'current' && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                Aktualna
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {new Date(version.date).toLocaleString('pl-PL')} • {version.author}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {version.status !== 'current' && (
                          <button 
                            onClick={showDevelopmentToast}
                            className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Przywróć
                          </button>
                        )}
                        <button 
                          onClick={showDevelopmentToast}
                          className="px-3 py-1 text-xs bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Podgląd
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 ml-6">{version.changes}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Export Options */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Eksport scenariusza</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={showDevelopmentToast}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/80 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>PDF</span>
                </button>
                <button 
                  onClick={showDevelopmentToast}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/80 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>DOCX</span>
                </button>
                <button 
                  onClick={showDevelopmentToast}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-lg hover:bg-white/80 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>JSON</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}